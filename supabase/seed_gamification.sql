-- Gamification seed data for DSA Planner.
-- Achievements are keyed by code; weekly challenges are keyed by week_no (all dates are derived in the app).

INSERT INTO achievements (code, category, name, description, criteria, icon) VALUES
  ('first_study_day', 'consistency', 'First Study Day', 'One session is all it takes to begin. Small, steady steps build lasting habits.', '{"type":"active_days","count":1}'::jsonb, 'Star'),
  ('streak_3', 'consistency', '3-Day Streak', 'Three days in a row. You are building momentum one session at a time.', '{"type":"streak","days":3}'::jsonb, 'Flame'),
  ('streak_7', 'consistency', '7-Day Streak', 'A full week of showing up. Consistency is becoming part of your routine.', '{"type":"streak","days":7}'::jsonb, 'Flame'),
  ('streak_14', 'consistency', '14-Day Streak', 'Two weeks of steady practice. Every quiet session adds up.', '{"type":"streak","days":14}'::jsonb, 'Zap'),
  ('streak_30', 'consistency', '30-Day Streak', 'Thirty days of dedication. Your daily habit is now firmly rooted.', '{"type":"streak","days":30}'::jsonb, 'Flame'),
  ('streak_50', 'consistency', '50-Day Streak', 'Fifty days of steady effort. Your routine is quietly carrying you forward.', '{"type":"streak","days":50}'::jsonb, 'Medal'),
  ('streak_100', 'consistency', '100-Day Streak', 'One hundred days of practice. A remarkable habit, built one day at a time.', '{"type":"streak","days":100}'::jsonb, 'Trophy'),
  ('first_problem_solved', 'problems', 'First Problem Solved', 'Your first solved problem. Every strong foundation starts with a single step.', '{"type":"problems_solved","count":1}'::jsonb, 'Code2'),
  ('problems_10', 'problems', '10 Problems Solved', 'Ten problems solved. Each one makes the next a little easier.', '{"type":"problems_solved","count":10}'::jsonb, 'Target'),
  ('problems_50', 'problems', '50 Problems Solved', 'Fifty problems solved. Patient, regular practice is paying off.', '{"type":"problems_solved","count":50}'::jsonb, 'Award'),
  ('problems_100', 'problems', '100 Problems Solved', 'One hundred problems solved. Look how far steady repetition has brought you.', '{"type":"problems_solved","count":100}'::jsonb, 'Medal'),
  ('problems_200', 'problems', '200 Problems Solved', 'Two hundred problems solved. Consistent work has become real skill.', '{"type":"problems_solved","count":200}'::jsonb, 'Trophy'),
  ('first_topic_completed', 'learning', 'First Topic Completed', 'Your first topic completed. Understanding grows one concept at a time.', '{"type":"topics_completed","count":1}'::jsonb, 'BookOpen'),
  ('first_week_completed', 'learning', 'First Week Completed', 'A whole week of the roadmap finished. Keep the gentle pace going.', '{"type":"weeks_completed","count":1}'::jsonb, 'Layers'),
  ('first_month_completed', 'learning', 'First Month Completed', 'A full month of learning complete. Your steady effort is adding up.', '{"type":"months_completed","count":1}'::jsonb, 'Rocket'),
  ('roadmap_completed', 'learning', 'Entire Roadmap Completed', 'The entire roadmap is complete. Enjoy the journey you built for yourself.', '{"type":"roadmap_completed","count":1}'::jsonb, 'CheckCircle2'),
  ('first_medium_problem', 'difficulty', 'First Medium Problem', 'Your first medium problem solved. Challenging yourself at a steady pace.', '{"type":"medium_solved","count":1}'::jsonb, 'Swords'),
  ('first_hard_problem', 'difficulty', 'First Hard Problem', 'Your first hard problem solved. Patience and persistence make the difference.', '{"type":"hard_solved","count":1}'::jsonb, 'Mountain'),
  ('medium_25', 'difficulty', '25 Medium Problems', 'Twenty-five medium problems solved. Your confidence is growing with each attempt.', '{"type":"medium_solved","count":25}'::jsonb, 'Swords'),
  ('hard_10', 'difficulty', '10 Hard Problems', 'Ten hard problems solved. Difficult ideas become familiar with calm, repeated practice.', '{"type":"hard_solved","count":10}'::jsonb, 'Snowflake')
ON CONFLICT (code) DO NOTHING;

INSERT INTO weekly_challenges (week_no, title, description, metric, target_value) VALUES
  (1, 'Foundations Together', 'Together, solve array and complexity problems; every combined solution strengthens the base.', 'problems', 12),
  (2, 'Strings and Hashing as a Team', 'Combined focused minutes on strings and hashing build a shared, stronger toolkit.', 'minutes', 720),
  (3, 'Sorting the Way Through', 'Together, complete searching and sorting topics so both of you share the same solid ground.', 'topics', 8),
  (4, 'Array Patterns, Combined', 'Together, work through medium array-pattern problems and grow your shared problem-solving range.', 'medium_problems', 5),
  (5, 'Recursion Together', 'Combined effort on recursion and backtracking problems turns tricky ideas into familiar ones.', 'problems', 14),
  (6, 'Linked Lists in Tandem', 'Together, spend dedicated minutes on linked lists, learning each twist at a shared pace.', 'minutes', 660),
  (7, 'Stacks and Queues Together', 'Together, finish stacks and queues topics and keep your shared roadmap moving.', 'topics', 7),
  (8, 'Advanced Patterns, Shared Progress', 'Combined medium-problem practice on advanced patterns deepens both of your understanding.', 'medium_problems', 6),
  (9, 'Binary Trees Together', 'Together, solve binary tree problems and let each explanation help the other.', 'problems', 16),
  (10, 'Deeper into Trees', 'Combined focused time on advanced trees makes complex structures feel manageable.', 'minutes', 780),
  (11, 'Graph Fundamentals, Together', 'Together, complete graph fundamentals topics and build a shared map of the ideas.', 'topics', 8),
  (12, 'Advanced Graphs as a Pair', 'Together, take on medium advanced-graph problems and combine what each of you learns.', 'medium_problems', 6),
  (13, 'Greedy Choices Together', 'Together, solve greedy problems; every combined solution adds to your shared progress.', 'problems', 15),
  (14, 'Dynamic Programming Foundations', 'Combined minutes on DP fundamentals give both of you room to think it through.', 'minutes', 840),
  (15, 'DP in Practice', 'Together, work through medium DP application problems and learn from each solution.', 'medium_problems', 7),
  (16, 'Bits and Advanced DP', 'Together, give advanced DP and bit manipulation your full, calm attention in one shared block of minutes.', 'minutes', 900),
  (17, 'Revision Round, Together', 'Combined revision problems help both of you revisit old ideas with fresh confidence.', 'problems', 18),
  (18, 'Full Revision, Side by Side', 'Together, complete a broad set of revision topics so nothing is left behind.', 'topics', 12),
  (19, 'Assessment Practice, Together', 'Together, work through medium assessment-style problems; your combined total is the goal.', 'medium_problems', 8),
  (20, 'Final Prep as a Team', 'Together, solve a final mixed set of problems and finish with calm, shared confidence.', 'problems', 20)
ON CONFLICT (week_no) DO NOTHING;

-- Row counts: 20 achievements and 20 weekly challenges.
