from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import random
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# Load all models and data
print("Loading models...")
MODELS_DIR = os.path.join(BASE_DIR, 'models')

model = joblib.load(os.path.join(MODELS_DIR, 'match_predictor.joblib'))
le = joblib.load(os.path.join(MODELS_DIR, 'label_encoder.joblib'))
kmeans = joblib.load(os.path.join(MODELS_DIR, 'kmeans_model.joblib'))
scaler = joblib.load(os.path.join(MODELS_DIR, 'scaler.joblib'))
cluster_features = joblib.load(os.path.join(MODELS_DIR, 'cluster_features.joblib'))

import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, '..', 'data', 'processed')

profiles_df = pd.read_csv(os.path.join(DATA_DIR, 'team_profiles.csv'))
matches_df = pd.read_csv(os.path.join(DATA_DIR, 'matches_clean.csv'))
print("✅ All models loaded!")

# ─── Real 2026 World Cup Groups ───────────────────────────────────────────
GROUPS_2026 = {
    'A': ['Mexico', 'South Africa', 'South Korea', 'Czech Republic'],
    'B': ['Canada', 'Bosnia and Herzegovina', 'Qatar', 'Switzerland'],
    'C': ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
    'D': ['United States', 'Paraguay', 'Australia', 'Turkey'],
    'E': ['Germany', 'Ivory Coast', 'Ecuador', 'Curacao'],
    'F': ['Portugal', 'Nigeria', 'Colombia', 'New Zealand'],
    'G': ['France', 'Belgium', 'Peru', 'Iran'],
    'H': ['England', 'Senegal', 'Serbia', 'Panama'],
    'I': ['Brazil', 'Japan', 'Croatia', 'Chile'],
    'J': ['Argentina', 'Algeria', 'Austria', 'Jordan'],
    'K': ['Netherlands', 'Cameroon', 'Ghana', 'Uzbekistan'],
    'L': ['Denmark', 'Morocco', 'Haiti', 'Scotland'],
}

# ─── Helper ───────────────────────────────────────────
def predict_match(home, away, stage=2):
    home_stats = profiles_df[profiles_df['Team'] == home]
    away_stats = profiles_df[profiles_df['Team'] == away]
    avg = profiles_df.mean(numeric_only=True)

    home_wr    = home_stats['Win Rate'].values[0]      if len(home_stats) > 0 else avg['Win Rate']
    away_wr    = away_stats['Win Rate'].values[0]      if len(away_stats) > 0 else avg['Win Rate']
    home_goals = home_stats['Goals Per Game'].values[0] if len(home_stats) > 0 else avg['Goals Per Game']
    away_goals = away_stats['Goals Per Game'].values[0] if len(away_stats) > 0 else avg['Goals Per Game']

    try:
        home_enc = le.transform([home])[0]
    except:
        home_enc = 0
    try:
        away_enc = le.transform([away])[0]
    except:
        away_enc = 0

    features = pd.DataFrame([{
        'Home Team Encoded':  home_enc,
        'Away Team Encoded':  away_enc,
        'Home Win Rate':      home_wr,
        'Away Win Rate':      away_wr,
        'Home Avg Goals':     home_goals,
        'Away Avg Goals':     away_goals,
        'Goal Diff Avg':      home_goals - away_goals,
        'Win Rate Diff':      home_wr - away_wr,
        'Home Recent Form':   home_wr,
        'Away Recent Form':   away_wr,
        'Stage Encoded':      stage,
        'Extra Time':         0,
        'Penalty Shootout':   0
    }])

    probs      = model.predict_proba(features)[0]
    home_prob  = probs[0] + probs[2] * 0.5
    away_prob  = probs[1] + probs[2] * 0.5
    draw_prob  = probs[2]

    return {
        'home_win_prob':    round(float(home_prob) * 100, 1),
        'away_win_prob':    round(float(away_prob) * 100, 1),
        'draw_prob':        round(float(draw_prob) * 100, 1),
        'predicted_winner': home if home_prob > away_prob else away,
        'confidence':       round(float(max(home_prob, away_prob)) * 100, 1)
    }


def simulate_group(group_name, teams):
    """Simulate all 6 matches in a group and return standings + results."""
    standings = {
        team: {'points': 0, 'gd': 0, 'gf': 0, 'ga': 0,
               'wins': 0, 'draws': 0, 'losses': 0, 'played': 0}
        for team in teams
    }
    matches = []
    avg_goals = profiles_df['Goals Per Game'].mean()

    for i in range(len(teams)):
        for j in range(i + 1, len(teams)):
            home, away = teams[i], teams[j]
            result = predict_match(home, away, stage=1)

            home_xg = profiles_df[profiles_df['Team'] == home]['Goals Per Game'].values
            away_xg = profiles_df[profiles_df['Team'] == away]['Goals Per Game'].values
            hg_base = float(home_xg[0]) if len(home_xg) > 0 else avg_goals
            ag_base = float(away_xg[0]) if len(away_xg) > 0 else avg_goals

            if result['draw_prob'] > 30:
                hg = ag = max(round((hg_base + ag_base) / 2) - 1, 0)
                standings[home]['points'] += 1
                standings[away]['points'] += 1
                standings[home]['draws']  += 1
                standings[away]['draws']  += 1
            elif result['predicted_winner'] == home:
                hg = max(round(hg_base), 1)
                ag = max(round(ag_base) - 1, 0)
                if hg <= ag:
                    hg = ag + 1
                standings[home]['points'] += 3
                standings[home]['wins']   += 1
                standings[away]['losses'] += 1
            else:
                ag = max(round(ag_base), 1)
                hg = max(round(hg_base) - 1, 0)
                if ag <= hg:
                    ag = hg + 1
                standings[away]['points'] += 3
                standings[away]['wins']   += 1
                standings[home]['losses'] += 1

            for team, gf, ga in [(home, hg, ag), (away, ag, hg)]:
                standings[team]['gf']     += gf
                standings[team]['ga']     += ga
                standings[team]['gd']     += (gf - ga)
                standings[team]['played'] += 1

            matches.append({
                'home':           home,
                'away':           away,
                'predicted_score': f"{hg} - {ag}",
                'winner':         result['predicted_winner'],
                'home_win_prob':  result['home_win_prob'],
                'away_win_prob':  result['away_win_prob'],
                'draw_prob':      result['draw_prob']
            })

    # Sort: points → goal difference → goals scored
    sorted_standings = sorted(
        standings.items(),
        key=lambda x: (x[1]['points'], x[1]['gd'], x[1]['gf']),
        reverse=True
    )

    ranked = []
    for rank, (team, stats) in enumerate(sorted_standings, 1):
        ranked.append({
            'rank':     rank,
            'team':     team,
            'played':   stats['played'],
            'wins':     stats['wins'],
            'draws':    stats['draws'],
            'losses':   stats['losses'],
            'gf':       stats['gf'],
            'ga':       stats['ga'],
            'gd':       stats['gd'],
            'points':   stats['points'],
            'advances': rank <= 2
        })

    return {'standings': ranked, 'matches': matches}


# ─── Routes ───────────────────────────────────────────

@app.route('/')
def home():
    return jsonify({
        'message':   '⚽ World Cup 2026 AI API',
        'endpoints': ['/teams', '/predict', '/team-stats/<team>',
                      '/head-to-head', '/group-stage', '/group-stage/<letter>',
                      '/simulate']
    })


@app.route('/teams')
def get_teams():
    teams = profiles_df['Team'].sort_values().tolist()
    return jsonify({'teams': teams, 'count': len(teams)})


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    home = data.get('home_team')
    away = data.get('away_team')
    if not home or not away:
        return jsonify({'error': 'Please provide home_team and away_team'}), 400
    result = predict_match(home, away)
    result['home_team'] = home
    result['away_team'] = away
    return jsonify(result)


@app.route('/team-stats/<team_name>')
def team_stats(team_name):
    stats = profiles_df[profiles_df['Team'] == team_name]
    if len(stats) == 0:
        return jsonify({'error': f'Team {team_name} not found'}), 404
    s = stats.iloc[0]
    return jsonify({
        'team':              team_name,
        'games':             int(s['Games']),
        'win_rate':          round(float(s['Win Rate']) * 100, 1),
        'goals_per_game':    round(float(s['Goals Per Game']), 2),
        'conceded_per_game': round(float(s['Conceded Per Game']), 2),
        'goal_difference':   round(float(s['Goal Difference']), 2),
        'play_style':        s['Play Style']
    })


@app.route('/head-to-head', methods=['POST'])
def head_to_head():
    data  = request.json
    team1 = data.get('team1')
    team2 = data.get('team2')

    h2h = matches_df[
        ((matches_df['Home Team Name'] == team1) & (matches_df['Away Team Name'] == team2)) |
        ((matches_df['Home Team Name'] == team2) & (matches_df['Away Team Name'] == team1))
    ]

    if len(h2h) == 0:
        return jsonify({'matches': 0, 'message': 'No head to head history'})

    team1_wins = len(h2h[
        ((h2h['Home Team Name'] == team1) & (h2h['Home Team Win'] == 1)) |
        ((h2h['Away Team Name'] == team1) & (h2h['Away Team Win'] == 1))
    ])
    team2_wins = len(h2h[
        ((h2h['Home Team Name'] == team2) & (h2h['Home Team Win'] == 1)) |
        ((h2h['Away Team Name'] == team2) & (h2h['Away Team Win'] == 1))
    ])
    draws = len(h2h[h2h['Draw'] == 1])

    return jsonify({
        'team1':          team1,
        'team2':          team2,
        'total_matches':  len(h2h),
        'team1_wins':     int(team1_wins),
        'team2_wins':     int(team2_wins),
        'draws':          int(draws),
        'recent_matches': h2h[['Year', 'Home Team Name', 'Away Team Name',
                                'Home Team Score', 'Away Team Score',
                                'Result']].tail(5).to_dict('records')
    })


@app.route('/group-stage')
def group_stage():
    """Simulate all 12 groups and return full standings + match results."""
    all_groups = {}
    for letter, teams in GROUPS_2026.items():
        all_groups[f'Group {letter}'] = simulate_group(letter, teams)
    return jsonify(all_groups)


@app.route('/group-stage/<letter>')
def single_group(letter):
    """Simulate a single group — e.g. /group-stage/A"""
    letter = letter.upper()
    if letter not in GROUPS_2026:
        return jsonify({'error': f'Group {letter} not found'}), 404
    return jsonify({f'Group {letter}': simulate_group(letter, GROUPS_2026[letter])})

@app.route('/simulate')
def simulate():
    # Step 1 — Simulate all groups once
    group_results = {}
    for letter, teams in GROUPS_2026.items():
        group_results[letter] = simulate_group(letter, teams)

    # Step 2 — Get winners, runners-up, third place from each group
    winners    = {l: group_results[l]['standings'][0]['team'] for l in GROUPS_2026}
    runners_up = {l: group_results[l]['standings'][1]['team'] for l in GROUPS_2026}
    thirds     = {l: group_results[l]['standings'][2]         for l in GROUPS_2026}

    # Step 3 — Pick best 8 third-place teams
    third_list = sorted(
        thirds.values(),
        key=lambda x: (x['points'], x['gd'], x['gf']),
        reverse=True
    )
    best_thirds = {t['team']: True for t in third_list[:8]}

    def third(group):
        t = thirds[group]['team']
        return t if t in best_thirds else None

    # Step 4 — Official FIFA Round of 32 matchups
    # Based on official match schedule from FIFA
    W = winners
    R = runners_up

    round_of_32 = [
        (R['A'], R['B']),
        (W['C'], R['F']),
        (W['F'], R['C']),
        (W['E'], third('A') or third('B') or third('C') or third('D') or third('F')),
        (W['I'], third('C') or third('D') or third('G') or third('H') or third('F')),
        (W['A'], third('C') or third('E') or third('H') or third('I') or third('F')),
        (W['L'], third('E') or third('H') or third('I') or third('J') or third('K')),
        (W['D'], third('B') or third('E') or third('F') or third('I') or third('J')),
        (W['G'], third('A') or third('E') or third('H') or third('I') or third('J')),
        (R['K'], R['L']),
        (W['H'], R['J']),
        (W['B'], third('E') or third('F') or third('G') or third('I') or third('J')),
        (W['J'], R['H']),
        (R['D'], R['G']),
        (W['K'], third('D') or third('E') or third('I') or third('J') or third('L')),
        (R['E'], R['I']),
    ]

    # Filter out any None matchups (if third place team didn't qualify)
    round_of_32 = [(h, a) for h, a in round_of_32 if h and a]

    # Step 5 — Run knockout rounds
    rounds = []
    current_matches = round_of_32
    round_names = ['Round of 32', 'Round of 16',
                   'Quarter Finals', 'Semi Finals', 'Final']
    round_num = 0

    while len(current_matches) > 0:
        next_round_teams = []
        matches = []

        for home, away in current_matches:
            result = predict_match(home, away, stage=3)
            winner = result['predicted_winner']
            matches.append({
                'home': home, 'away': away,
                'winner': winner,
                'home_prob': result['home_win_prob'],
                'away_prob': result['away_win_prob']
            })
            next_round_teams.append(winner)

        rounds.append({
            'round': round_names[min(round_num, len(round_names) - 1)],
            'matches': matches
        })

        # Build next round pairs
        if len(next_round_teams) > 1:
            current_matches = [
                (next_round_teams[i], next_round_teams[i + 1])
                for i in range(0, len(next_round_teams) - 1, 2)
            ]
        else:
            break

        round_num += 1

    return jsonify({
        'winner': next_round_teams[0] if next_round_teams else 'TBD',
        'rounds': rounds
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)