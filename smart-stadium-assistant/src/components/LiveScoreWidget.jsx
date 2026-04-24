import React, { useState, useEffect } from 'react';
import { Trophy, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// RCB innings simulation - starts mid-match, progresses ball by ball
const generateRCBInnings = () => {
  const events = [];
  let runs = 185, wickets = 4, balls = 110; // 18.2 overs = 110 balls

  // Generate remaining balls up to 20 overs (120 balls)
  while (balls < 120) {
    balls++;
    const rand = Math.random();
    if (rand < 0.04 && wickets < 10) { wickets++; runs += 1; }        // wicket
    else if (rand < 0.12) { runs += 6; }                               // six
    else if (rand < 0.25) { runs += 4; }                               // four
    else if (rand < 0.45) { runs += Math.floor(Math.random() * 3) + 1; } // 1-3 runs
    // else dot ball

    const over = Math.floor(balls / 6);
    const ball = balls % 6 === 0 ? 6 : balls % 6;
    events.push({ runs, wickets, over: over === 20 ? 20 : over, ball: ball === 6 ? 0 : ball });
  }
  return events;
};

// GT chase simulation
const generateGTInnings = (target) => {
  const events = [];
  let runs = 0, wickets = 0, balls = 0;

  while (balls < 120 && runs < target && wickets < 10) {
    balls++;
    const rand = Math.random();
    const needed = target - runs;
    const balsLeft = 120 - balls;
    const rrr = balsLeft > 0 ? (needed / balsLeft) * 6 : 999;

    if (rand < 0.05 && wickets < 10) { wickets++; runs += 1; }
    else if (rand < 0.15) { runs += 6; }
    else if (rand < 0.30) { runs += 4; }
    else if (rand < 0.50) { runs += Math.floor(Math.random() * 3) + 1; }

    const over = Math.floor(balls / 6);
    const ball = balls % 6 === 0 ? 6 : balls % 6;
    events.push({ runs, wickets, over, ball: ball === 6 ? 0 : ball, rrr: rrr.toFixed(2) });
  }
  return events;
};

const BATSMEN_RCB = ['Virat Kohli', 'Faf du Plessis', 'Glenn Maxwell', 'Rajat Patidar', 'Dinesh Karthik'];
const BATSMEN_GT = ['Shubman Gill', 'Wriddhiman Saha', 'Hardik Pandya', 'David Miller', 'Vijay Shankar'];
const BOWLERS_RCB = ['Mohammed Siraj', 'Josh Hazlewood', 'Wanindu Hasaranga', 'Harshal Patel'];
const BOWLERS_GT = ['Rashid Khan', 'Lockie Ferguson', 'Mohammed Shami', 'Yash Dayal'];

const getCommentary = (innings, score, wickets, over, ball, prev) => {
  if (!prev) return '🏏 Match is live!';
  const diff = score - prev.runs;
  const isWicket = wickets > prev.wickets;
  if (isWicket) {
    const batter = innings === 'rcb' ? BATSMEN_RCB[wickets - 1] : BATSMEN_GT[wickets - 1];
    const bowler = innings === 'rcb' ? BOWLERS_GT[Math.floor(Math.random() * BOWLERS_GT.length)] : BOWLERS_RCB[Math.floor(Math.random() * BOWLERS_RCB.length)];
    return `🚨 WICKET! ${batter} is OUT. ${bowler} strikes! ${innings.toUpperCase()} ${score}/${wickets}`;
  }
  if (diff === 6) {
    const batter = innings === 'rcb' ? BATSMEN_RCB[Math.floor(Math.random() * 3)] : BATSMEN_GT[Math.floor(Math.random() * 3)];
    return `💥 SIX! ${batter} smashes it out of the park! ${innings.toUpperCase()} ${score}/${wickets}`;
  }
  if (diff === 4) {
    const batter = innings === 'rcb' ? BATSMEN_RCB[Math.floor(Math.random() * 3)] : BATSMEN_GT[Math.floor(Math.random() * 3)];
    return `🔥 FOUR! ${batter} drives it to the boundary! ${innings.toUpperCase()} ${score}/${wickets}`;
  }
  if (diff === 0) return `• Dot ball. Good bowling. Over ${over}.${ball}`;
  return `✅ ${diff} run${diff > 1 ? 's' : ''}. ${innings.toUpperCase()} ${score}/${wickets} (${over}.${ball} ov)`;
};

const LiveScoreWidget = () => {
  // Phase 1: RCB innings (last 10 balls)
  const rcbFrames = generateRCBInnings();
  const rcbTarget = rcbFrames[rcbFrames.length - 1];

  const [phase, setPhase] = useState('rcb'); // 'rcb' | 'innings_break' | 'gt'
  const [frameIdx, setFrameIdx] = useState(0);
  const [rcbFinal] = useState({ runs: rcbTarget.runs, wickets: rcbTarget.wickets });
  const [gtFrames] = useState(() => generateGTInnings(rcbTarget.runs + 1));

  const [score, setScore] = useState({ runs: 185, wickets: 4 });
  const [overs, setOvers] = useState('18.2');
  const [commentary, setCommentary] = useState('🏏 RCB in full flow! Can they cross 200?');
  const [isInningsBreak, setIsInningsBreak] = useState(false);

  // GT chase state
  const [gtScore, setGtScore] = useState({ runs: 0, wickets: 0 });
  const [gtOvers, setGtOvers] = useState('0.0');

  useEffect(() => {
    if (phase === 'rcb') {
      if (frameIdx >= rcbFrames.length) {
        // RCB innings done → innings break
        setIsInningsBreak(true);
        setPhase('innings_break');
        setTimeout(() => {
          setIsInningsBreak(false);
          setPhase('gt');
          setFrameIdx(0);
        }, 5000);
        return;
      }
      const interval = setInterval(() => {
        const frame = rcbFrames[frameIdx];
        const prev = frameIdx > 0 ? rcbFrames[frameIdx - 1] : { runs: 185, wickets: 4 };
        setScore({ runs: frame.runs, wickets: frame.wickets });
        setOvers(`${frame.over}.${frame.ball}`);
        setCommentary(getCommentary('rcb', frame.runs, frame.wickets, frame.over, frame.ball, prev));
        setFrameIdx(f => f + 1);
      }, 2500);
      return () => clearInterval(interval);
    }

    if (phase === 'gt') {
      if (frameIdx >= gtFrames.length) return;
      const interval = setInterval(() => {
        const frame = gtFrames[frameIdx];
        const prev = frameIdx > 0 ? gtFrames[frameIdx - 1] : { runs: 0, wickets: 0 };
        setGtScore({ runs: frame.runs, wickets: frame.wickets });
        setGtOvers(`${frame.over}.${frame.ball}`);
        setCommentary(getCommentary('gt', frame.runs, frame.wickets, frame.over, frame.ball, prev));
        setFrameIdx(f => f + 1);
      }, 2200);
      return () => clearInterval(interval);
    }
  }, [phase, frameIdx]);

  const isGTChasing = phase === 'gt' || phase === 'innings_break';
  const target = rcbFinal.runs + 1;
  const gtNeeded = target - gtScore.runs;
  const gtResult = gtScore.runs >= target ? '🎉 GT Wins!' : gtScore.wickets >= 10 ? '🏆 RCB Wins!' : null;

  return (
    <div className="w-full bg-gradient-to-r from-primary via-primary to-blue-700 text-primary-foreground rounded-2xl shadow-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 z-10 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-300" />
          <div>
            <p className="text-xs font-medium opacity-80 uppercase tracking-wider">🔴 Live Cricket</p>
            <h3 className="font-bold">IPL T20 • Match 45</h3>
          </div>
        </div>

        <div className="h-10 w-px bg-primary-foreground/20 hidden md:block"></div>

        {isInningsBreak ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center px-4 py-2 bg-white/10 rounded-xl">
            <span className="text-sm font-bold animate-pulse">⏸ Innings Break</span>
            <span className="text-xs opacity-80">RCB scored {rcbFinal.runs}/{rcbFinal.wickets}</span>
            <span className="text-xs font-bold text-yellow-300">GT need {target} to win</span>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between md:justify-start gap-6">
            {/* RCB */}
            <div className="flex flex-col items-center">
              <span className="text-lg font-black tracking-tight text-red-300">RCB</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={score.runs}
                  initial={{ scale: 1.3, color: '#ffd700' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="text-2xl font-bold"
                >
                  {phase === 'rcb' ? `${score.runs}/${score.wickets}` : `${rcbFinal.runs}/${rcbFinal.wickets}`}
                </motion.span>
              </AnimatePresence>
              <span className="text-xs opacity-80">
                {phase === 'rcb' ? `(${overs} ov)` : '(20.0 ov)'}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="bg-primary-foreground/20 text-primary-foreground px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">VS</span>
              {isGTChasing && !isInningsBreak && (
                <span className="text-[10px] font-bold text-yellow-300 bg-black/20 px-2 py-0.5 rounded-full">
                  Need {gtNeeded > 0 ? `${gtNeeded} off ${Math.max(0, 120 - (parseInt(gtOvers) * 6 + parseInt(gtOvers.split('.')[1] || 0)))} balls` : '—'}
                </span>
              )}
            </div>

            {/* GT */}
            <div className="flex flex-col items-center">
              <span className="text-lg font-black tracking-tight text-blue-300">GT</span>
              {!isGTChasing ? (
                <span className="text-sm font-bold mt-1 opacity-70">Yet to bat</span>
              ) : (
                <>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={gtScore.runs}
                      initial={{ scale: 1.3, color: '#ffd700' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      className="text-2xl font-bold"
                    >
                      {gtScore.runs}/{gtScore.wickets}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-xs opacity-80">({gtOvers} ov)</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 bg-primary-foreground/10 px-4 py-2 rounded-xl border border-primary-foreground/20 w-full md:w-auto z-10">
        {gtResult ? (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-sm font-bold text-yellow-300">{gtResult}</motion.span>
        ) : (
          <>
            <Activity className="w-4 h-4 text-red-300 animate-pulse shrink-0" />
            <div className="relative h-5 w-full md:w-80 overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={commentary}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-medium absolute whitespace-nowrap"
                >
                  {commentary}
                </motion.p>
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveScoreWidget;
