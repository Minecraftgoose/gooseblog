---
title: '驾考模拟器！'
date: '2026-07-19 21:09:39'
updated: '2026-07-22 14:50:25'
tags:
  - 'html小游戏'
categories:
  - '折腾'
cover: 'https://img.goose.cc.cd/i/ff8b6ed9fd67d1c118fc714c53f428d5.png'
og_image: 'https://img.goose.cc.cd/i/ff8b6ed9fd67d1c118fc714c53f428d5.png'
excerpt: '驾考模拟器！你能过科目三吗？'
description: '驾考模拟器！你能过科目三吗？'
slug: drive
---

<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>驾考模拟</title>
    <style>
        :root { --safe-bottom: env(safe-area-inset-bottom, 20px); }
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
        body { width: 100vw; height: 100vh; height: 100dvh; overflow: hidden; background: #1a1a1a; touch-action: manipulation; position: relative; font-family: sans-serif; }
        canvas#scene { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; z-index: 1; }
        .steering-container { position: absolute; left: 28px; bottom: calc(40px + var(--safe-bottom)); width: 150px; height: 150px; z-index: 10; pointer-events: auto; }
        canvas#steering { width: 150px; height: 150px; display: block; pointer-events: auto; cursor: grab; }
        canvas#steering:active { cursor: grabbing; }
        .pedals-container { position: absolute; right: 22px; bottom: calc(28px + var(--safe-bottom)); display: flex; flex-direction: column; align-items: center; gap: 16px; z-index: 10; pointer-events: auto; }
        .pedal { width: 88px; height: 88px; border-radius: 50%; border: 4px solid rgba(255,255,255,0.35); pointer-events: auto; cursor: pointer; transition: transform 0.06s ease; position: relative; }
        .pedal-throttle { background: rgba(60,180,75,0.45); box-shadow: 0 6px 20px rgba(0,0,0,0.45); }
        .pedal-brake { background: rgba(210,55,45,0.5); box-shadow: 0 6px 20px rgba(0,0,0,0.45); }
        .pedal:active,.pedal.active { transform: scale(0.9); }
        .pedal-throttle:active,.pedal-throttle.active { background: rgba(80,220,100,0.75); border-color: rgba(255,255,255,0.7); box-shadow: 0 0 30px rgba(80,220,100,0.5); }
        .pedal-brake:active,.pedal-brake.active { background: rgba(240,65,50,0.8); border-color: rgba(255,255,255,0.7); box-shadow: 0 0 30px rgba(240,65,50,0.55); }
        @media (max-width:480px) { .steering-container { left:14px; bottom:calc(24px + var(--safe-bottom)); width:120px; height:120px; } canvas#steering { width:120px; height:120px; } .pedals-container { right:10px; bottom:calc(18px + var(--safe-bottom)); gap:10px; } .pedal { width:70px; height:70px; border-width:3px; } }
        @media (min-width:768px) { .steering-container { left:40px; bottom:calc(50px + var(--safe-bottom)); width:170px; height:170px; } canvas#steering { width:170px; height:170px; } .pedals-container { right:32px; bottom:calc(36px + var(--safe-bottom)); gap:20px; } .pedal { width:100px; height:100px; } }
    </style>
</head>
<body>
    <canvas id="scene" tabindex="0"></canvas>
    <div class="steering-container"><canvas id="steering"></canvas></div>
    <div class="pedals-container">
        <div class="pedal pedal-throttle" id="pedal-throttle"></div>
        <div class="pedal pedal-brake" id="pedal-brake"></div>
    </div>
    <script>
        (function() {
            const sceneCanvas = document.getElementById('scene');
            const sceneCtx = sceneCanvas.getContext('2d');
            const steeringCanvas = document.getElementById('steering');
            const steeringCtx = steeringCanvas.getContext('2d');
            const throttleBtn = document.getElementById('pedal-throttle');
            const brakeBtn = document.getElementById('pedal-brake');
            let W, H, level = 0;
            const TOTAL_LEVELS = 6;
            let cameraFollow = false;

            // 驾照分系统（只读）
            const LICENSE_KEY = 'driverLicensePoints';
            const LICENSE_MAX = 12;
            let licensePoints = LICENSE_MAX;

            function loadLicensePoints() {
                const stored = localStorage.getItem(LICENSE_KEY);
                if (stored !== null) {
                    const val = parseFloat(stored);
                    if (!isNaN(val)) return Math.min(LICENSE_MAX, Math.max(0, val));
                }
                return LICENSE_MAX;
            }
            licensePoints = loadLicensePoints();

            function resize() {
                W = window.innerWidth; H = window.innerHeight;
                sceneCanvas.width = W * (window.devicePixelRatio || 1); sceneCanvas.height = H * (window.devicePixelRatio || 1);
                sceneCanvas.style.width = W + 'px'; sceneCanvas.style.height = H + 'px';
                sceneCtx.setTransform(1, 0, 0, 1, 0, 0); sceneCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
                const swSize = Math.min(170, Math.max(120, Math.min(W, H) * 0.18));
                const swEl = document.querySelector('.steering-container'); swEl.style.width = swSize + 'px'; swEl.style.height = swSize + 'px';
                steeringCanvas.width = swSize * (window.devicePixelRatio || 1); steeringCanvas.height = swSize * (window.devicePixelRatio || 1);
                steeringCanvas.style.width = swSize + 'px'; steeringCanvas.style.height = swSize + 'px';
                steeringCtx.setTransform(1, 0, 0, 1, 0, 0); steeringCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
            }
            window.addEventListener('resize', resize); resize();

            const CAR_LENGTH = Math.min(W, H) * 0.18;
            const CAR_WIDTH = CAR_LENGTH * 0.45;
            const WHEELBASE = CAR_LENGTH * 0.6;
            const ROAD_WIDTH = CAR_WIDTH * 2.2;
            const OBSTACLE_GAP = CAR_WIDTH * 0.3;

            let roadCenterY, roadTop, roadBottom;
            let carX, carY, carHeading, carSpeed, steeringAngle;
            let initialCarX, initialCarY, initialCarHeading;
            let steeringWheelAngle = 0;
            let steeringActiveFingerId = null;
            let lastSteeringTouchAngle = 0;
            let throttleActive = false, brakeActive = false;
            let successTimer = 0, failTimer = 0, collisionFlash = 0, successFlash = 0;
            let lastTime = performance.now();

            const STEERING_MAX_RAD = 150 * Math.PI / 180;
            const FRONT_WHEEL_MAX_RAD = 35 * Math.PI / 180;
            const STEERING_RETURN_RATE = 5.5;
            const KEY_STEER_SPEED = 3.5;
            const ACCELERATION = 150;
            const BRAKE_DECEL = 450;
            const FRICTION = 200;
            const MAX_SPEED_FORWARD = 180;
            const MAX_SPEED_REVERSE = 90;
            const TARGET_HEADING_DOWN = Math.PI / 2;
            const TARGET_HEADING_UP = -Math.PI / 2;
            const HEADING_TOLERANCE = 0.25;

            let parkingLeft, parkingRight, parkingTop, parkingBottom, leftObstacle, rightObstacle;
            let sideParkingLeft, sideParkingRight, sideParkingTop, sideParkingBottom, frontObsSide, rearObsSide;
            let lTurnH, lTurnV, turnTargetX, turnTargetY, turnTargetR;
            let meetingCarObs, meetingPassZone;
            let overtakeCarObs, overtakeEndZone;
            let uTurnZone;

            const keyState = { w: false, a: false, s: false, d: false };

            function normalizeAngle(a) { return ((a % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI; }
            function getCarCorners(x, y, h, l, w) {
                const hw = w / 2, hl = l / 2, cosH = Math.cos(h), sinH = Math.sin(h);
                return [{ lx: -hl, ly: -hw }, { lx: hl, ly: -hw }, { lx: hl, ly: hw }, { lx: -hl, ly: hw }].map(c => ({ x: x + c.lx * cosH - c.ly * sinH, y: y + c.lx * sinH + c.ly * cosH }));
            }
            function pointInRect(px, py, rx, ry, rw, rh) { return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh; }
            function satCollision(cA, cB) {
                function axes(c) { const a = []; for (let i = 0; i < c.length; i++) { const j = (i + 1) % c.length, dx = c[j].x - c[i].x, dy = c[j].y - c[i].y, l = Math.sqrt(dx * dx + dy * dy); a.push({ x: -dy / l, y: dx / l }, { x: dx / l, y: dy / l }); } return a; }
                function proj(c, ax) { let min = Infinity, max = -Infinity; for (const p of c) { const v = p.x * ax.x + p.y * ax.y; if (v < min) min = v; if (v > max) max = v; } return { min, max }; }
                for (const ax of [...axes(cA), ...axes(cB)]) { const pA = proj(cA, ax), pB = proj(cB, ax); if (pA.max < pB.min || pB.max < pA.min) return false; }
                return true;
            }

            function recalcScene() {
                roadCenterY = H * 0.55; roadTop = roadCenterY - ROAD_WIDTH / 2; roadBottom = roadCenterY + ROAD_WIDTH / 2;
                const parkW = CAR_WIDTH * 1.5; const parkH = CAR_LENGTH * 1.3;
                parkingTop = roadTop - parkH - 14; parkingBottom = roadTop - 14; parkingLeft = W * 0.5 - parkW / 2; parkingRight = W * 0.5 + parkW / 2;
                leftObstacle = { x: parkingLeft - CAR_WIDTH / 2 - OBSTACLE_GAP, y: (parkingTop + parkingBottom) / 2, w: CAR_LENGTH, h: CAR_WIDTH, heading: Math.PI / 2 };
                rightObstacle = { x: parkingRight + CAR_WIDTH / 2 + OBSTACLE_GAP, y: (parkingTop + parkingBottom) / 2, w: CAR_LENGTH, h: CAR_WIDTH, heading: Math.PI / 2 };
                const spW = CAR_LENGTH * 1.4; const spH = CAR_WIDTH * 1.3;
                sideParkingLeft = W * 0.5 - spW / 2; sideParkingRight = W * 0.5 + spW / 2; sideParkingTop = roadTop - spH - 12; sideParkingBottom = roadTop - 12;
                frontObsSide = { x: sideParkingRight + CAR_LENGTH / 2 + OBSTACLE_GAP, y: (sideParkingTop + sideParkingBottom) / 2, w: CAR_LENGTH, h: CAR_WIDTH, heading: 0 };
                rearObsSide = { x: sideParkingLeft - CAR_LENGTH / 2 - OBSTACLE_GAP, y: (sideParkingTop + sideParkingBottom) / 2, w: CAR_LENGTH, h: CAR_WIDTH, heading: 0 };
                const turnRoadW = CAR_WIDTH * 2.4;
                lTurnH = { x1: W * 0.06, y1: roadCenterY - turnRoadW / 2, x2: W * 0.62, y2: roadCenterY + turnRoadW / 2 };
                lTurnV = { x1: lTurnH.x2 - turnRoadW, y1: H * 0.06, x2: lTurnH.x2, y2: lTurnH.y2 };
                turnTargetX = lTurnV.x1 + (lTurnV.x2 - lTurnV.x1) / 2; turnTargetY = H * 0.18; turnTargetR = CAR_LENGTH * 1.0;
                meetingCarObs = { x: W * 0.58, y: roadCenterY - CAR_WIDTH * 0.6, w: CAR_LENGTH, h: CAR_WIDTH, heading: Math.PI };
                meetingPassZone = { x1: W * 0.72, y1: roadCenterY + CAR_WIDTH * 0.3, x2: W * 0.82, y2: roadBottom - 4 };
                overtakeCarObs = { x: W * 0.50, y: roadCenterY + CAR_WIDTH * 0.55, w: CAR_LENGTH, h: CAR_WIDTH, heading: 0 };
                overtakeEndZone = { x: W * 0.85, y: roadCenterY, r: CAR_LENGTH * 0.9 };
                uTurnZone = { x: W * 0.55, y: roadCenterY, r: CAR_LENGTH * 1.6 };
                if (level === 0) { initialCarX = W * 0.2; initialCarY = roadCenterY; initialCarHeading = 0; }
                else if (level === 1) { initialCarX = sideParkingLeft - CAR_LENGTH * 1.6; initialCarY = roadCenterY; initialCarHeading = 0; }
                else if (level === 2) { initialCarX = W * 0.22; initialCarY = roadCenterY; initialCarHeading = 0; }
                else if (level === 3) { initialCarX = W * 0.18; initialCarY = roadCenterY; initialCarHeading = 0; }
                else if (level === 4) { initialCarX = W * 0.16; initialCarY = roadCenterY; initialCarHeading = 0; }
                else { initialCarX = W * 0.3; initialCarY = roadCenterY; initialCarHeading = 0; }
                carX = initialCarX; carY = initialCarY; carHeading = initialCarHeading; carSpeed = 0; steeringAngle = 0; steeringWheelAngle = 0;
                successTimer = 0; failTimer = 0; collisionFlash = 0; successFlash = 0;
            }
            recalcScene(); window.addEventListener('resize', () => { resize(); recalcScene(); });

            function checkLevel0Success() {
                if (level !== 0) return false;
                const corners = getCarCorners(carX, carY, carHeading, CAR_LENGTH, CAR_WIDTH);
                return corners.every(c => pointInRect(c.x, c.y, parkingLeft, parkingTop, parkingRight - parkingLeft, parkingBottom - parkingTop)) && Math.abs(carSpeed) < 8 && Math.abs(normalizeAngle(carHeading - TARGET_HEADING_DOWN)) < HEADING_TOLERANCE;
            }
            function checkLevel1Success() {
                if (level !== 1) return false;
                const corners = getCarCorners(carX, carY, carHeading, CAR_LENGTH, CAR_WIDTH);
                const fullyIn = corners.every(c => pointInRect(c.x, c.y, sideParkingLeft, sideParkingTop, sideParkingRight - sideParkingLeft, sideParkingBottom - sideParkingTop));
                return fullyIn && Math.abs(carSpeed) < 8 && Math.min(Math.abs(normalizeAngle(carHeading - 0)), Math.abs(normalizeAngle(carHeading - Math.PI))) < HEADING_TOLERANCE;
            }
            function checkLevel2Success() {
                if (level !== 2) return false;
                const dx = carX - turnTargetX, dy = carY - turnTargetY;
                return Math.sqrt(dx * dx + dy * dy) < turnTargetR && Math.abs(carSpeed) < 10 && Math.abs(normalizeAngle(carHeading - TARGET_HEADING_UP)) < HEADING_TOLERANCE;
            }
            function checkLevel3Success() {
                if (level !== 3) return false;
                return carX > meetingPassZone.x1 && carX < meetingPassZone.x2 && carY > meetingPassZone.y1 && carY < meetingPassZone.y2 && Math.abs(carSpeed) < 10 && Math.abs(normalizeAngle(carHeading - 0)) < HEADING_TOLERANCE;
            }
            function checkLevel4Success() {
                if (level !== 4) return false;
                const dx = carX - overtakeEndZone.x, dy = carY - overtakeEndZone.y;
                return Math.sqrt(dx * dx + dy * dy) < overtakeEndZone.r && Math.abs(carSpeed) < 10 && Math.abs(normalizeAngle(carHeading - 0)) < HEADING_TOLERANCE;
            }
            function checkLevel5Success() {
                if (level !== 5) return false;
                const dx = carX - uTurnZone.x, dy = carY - uTurnZone.y;
                const inZone = Math.sqrt(dx * dx + dy * dy) < uTurnZone.r;
                const hDiff = normalizeAngle(carHeading - Math.PI);
                return inZone && Math.abs(carSpeed) < 8 && Math.abs(hDiff) < HEADING_TOLERANCE;
            }
            function checkSuccess() {
                if (level === 0) return checkLevel0Success();
                if (level === 1) return checkLevel1Success();
                if (level === 2) return checkLevel2Success();
                if (level === 3) return checkLevel3Success();
                if (level === 4) return checkLevel4Success();
                if (level === 5) return checkLevel5Success();
                return false;
            }
            function isPointOnRoadLevel2(px, py) { return pointInRect(px, py, lTurnH.x1, lTurnH.y1, lTurnH.x2 - lTurnH.x1, lTurnH.y2 - lTurnH.y1) || pointInRect(px, py, lTurnV.x1, lTurnV.y1, lTurnV.x2 - lTurnV.x1, lTurnV.y2 - lTurnV.y1); }
            function isPointOnRoad(px, py) { return pointInRect(px, py, 0, roadTop, W, ROAD_WIDTH); }
            function isPointOnWideRoad(px, py) { const wideTop = roadCenterY - ROAD_WIDTH * 1.3, wideBottom = roadCenterY + ROAD_WIDTH * 1.3; return pointInRect(px, py, 0, wideTop, W, wideBottom - wideTop); }
            function checkObstacleCollision() {
                const carC = getCarCorners(carX, carY, carHeading, CAR_LENGTH, CAR_WIDTH);
                if (level === 0) return satCollision(carC, getCarCorners(leftObstacle.x, leftObstacle.y, leftObstacle.heading, leftObstacle.w, leftObstacle.h)) || satCollision(carC, getCarCorners(rightObstacle.x, rightObstacle.y, rightObstacle.heading, rightObstacle.w, rightObstacle.h));
                if (level === 1) return satCollision(carC, getCarCorners(frontObsSide.x, frontObsSide.y, frontObsSide.heading, frontObsSide.w, frontObsSide.h)) || satCollision(carC, getCarCorners(rearObsSide.x, rearObsSide.y, rearObsSide.heading, rearObsSide.w, rearObsSide.h));
                if (level === 3) return satCollision(carC, getCarCorners(meetingCarObs.x, meetingCarObs.y, meetingCarObs.heading, meetingCarObs.w, meetingCarObs.h));
                if (level === 4) return satCollision(carC, getCarCorners(overtakeCarObs.x, overtakeCarObs.y, overtakeCarObs.heading, overtakeCarObs.w, overtakeCarObs.h));
                return false;
            }
            function checkOutOfBounds() {
                const corners = getCarCorners(carX, carY, carHeading, CAR_LENGTH, CAR_WIDTH);
                if (level === 0 || level === 1) return carY < parkingTop - CAR_LENGTH || carY > roadBottom + CAR_LENGTH || carX < -CAR_LENGTH || carX > W + CAR_LENGTH;
                if (level === 2) { for (const c of corners) { if (!isPointOnRoadLevel2(c.x, c.y)) return true; } return false; }
                if (level === 3 || level === 4) { for (const c of corners) { if (!isPointOnRoad(c.x, c.y)) return true; } return false; }
                if (level === 5) { for (const c of corners) { if (!isPointOnWideRoad(c.x, c.y)) return true; } return false; }
                return false;
            }
            function resetCar() { carX = initialCarX; carY = initialCarY; carHeading = initialCarHeading; carSpeed = 0; steeringAngle = 0; steeringWheelAngle = 0; steeringActiveFingerId = null; successTimer = 0; failTimer = 0; collisionFlash = 0; successFlash = 0; }
            function advanceLevel() {
                if (level === TOTAL_LEVELS - 1) {
                    // 全部关卡完成，跳转到城市页面
                    window.location.href = 'https://page.goose.cc.cd/s/city';
                    return;
                }
                level = (level + 1) % TOTAL_LEVELS;
                recalcScene();
            }

            function drawRoundedRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath(); }
            function drawObstacle(ctx, obs, col, dk, lt) { ctx.save(); ctx.translate(obs.x, obs.y); ctx.rotate(obs.heading); drawRoundedRect(ctx, -obs.w / 2, -obs.h / 2, obs.w, obs.h, 6); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = dk; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = lt; ctx.fillRect(-obs.w / 2 + 6, -obs.h / 2 + 4, obs.w * 0.35, obs.h - 8); ctx.fillRect(obs.w / 2 - 6 - obs.w * 0.35, -obs.h / 2 + 4, obs.w * 0.35, obs.h - 8); ctx.restore(); }

            function drawCarOnCanvas(ctx) {
                const carColor = collisionFlash > 0 ? `rgba(255,${200-140*collisionFlash|0},${50-20*collisionFlash|0},1)` : 'rgba(235,175,50,1)';
                ctx.save(); ctx.translate(carX, carY); ctx.rotate(carHeading);
                ctx.fillStyle = carColor; ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 8; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2;
                drawRoundedRect(ctx, -CAR_LENGTH / 2, -CAR_WIDTH / 2, CAR_LENGTH, CAR_WIDTH, 8); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
                ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 2; ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(-CAR_LENGTH / 2 + 8, -CAR_WIDTH / 2 + 5, CAR_LENGTH * 0.3, CAR_WIDTH - 10); ctx.fillRect(CAR_LENGTH / 2 - 8 - CAR_LENGTH * 0.3, -CAR_WIDTH / 2 + 5, CAR_LENGTH * 0.3, CAR_WIDTH - 10);
                const fwOff = WHEELBASE / 2, rwOff = -WHEELBASE / 2;
                const whShort = CAR_WIDTH * 0.22, whLong = CAR_WIDTH * 0.55;
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(rwOff - whLong / 2, -CAR_WIDTH / 2 - whShort / 2, whLong, whShort);
                ctx.fillRect(rwOff - whLong / 2, CAR_WIDTH / 2 - whShort / 2, whLong, whShort);
                if (Math.abs(steeringAngle) > 0.01) {
                    ctx.save(); ctx.translate(fwOff, -CAR_WIDTH / 2); ctx.rotate(steeringAngle); ctx.fillStyle = '#222'; ctx.fillRect(-whLong / 2, -whShort / 2, whLong, whShort); ctx.restore();
                    ctx.save(); ctx.translate(fwOff, CAR_WIDTH / 2); ctx.rotate(steeringAngle); ctx.fillStyle = '#222'; ctx.fillRect(-whLong / 2, -whShort / 2, whLong, whShort); ctx.restore();
                } else {
                    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(fwOff - whLong / 2, -CAR_WIDTH / 2 - whShort / 2, whLong, whShort); ctx.fillRect(fwOff - whLong / 2, CAR_WIDTH / 2 - whShort / 2, whLong, whShort);
                }
                ctx.restore();
                if (successFlash > 0) { ctx.strokeStyle = `rgba(80,255,100,${0.6*successFlash})`; ctx.lineWidth = 4; ctx.setLineDash([]); const sc = getCarCorners(carX, carY, carHeading, CAR_LENGTH + 16, CAR_WIDTH + 16); ctx.beginPath(); ctx.moveTo(sc[0].x, sc[0].y); for (let i = 1; i < sc.length; i++) ctx.lineTo(sc[i].x, sc[i].y); ctx.closePath(); ctx.stroke(); }
            }

            function drawWorldElements(ctx) {
                ctx.fillStyle = '#b8b8a8'; ctx.fillRect(-W, -H, W * 3, H * 3);
                if (level === 0) {
                    const swTop = parkingTop - 20, swBottom = roadBottom + 20;
                    ctx.fillStyle = '#c8c8b8'; ctx.fillRect(0, swTop, W, roadTop - swTop); ctx.fillRect(0, roadBottom, W, swBottom - roadBottom);
                    ctx.fillStyle = '#4a4a42'; ctx.fillRect(0, roadTop, W, ROAD_WIDTH);
                    ctx.strokeStyle = '#f0f0e0'; ctx.lineWidth = 3; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(0, roadTop); ctx.lineTo(W, roadTop); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, roadBottom); ctx.lineTo(W, roadBottom); ctx.stroke();
                    ctx.setLineDash([18, 14]); ctx.strokeStyle = '#e8e8d0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, roadCenterY); ctx.lineTo(W, roadCenterY); ctx.stroke(); ctx.setLineDash([]);
                    ctx.fillStyle = successFlash > 0 ? `rgba(80,220,100,${0.15+0.25*successFlash})` : 'rgba(180,175,160,0.25)'; ctx.fillRect(parkingLeft, parkingTop, parkingRight - parkingLeft, parkingBottom - parkingTop);
                    ctx.strokeStyle = successFlash > 0 ? `rgba(${60+195*successFlash|0},${180+75*successFlash|0},${60+40*successFlash|0},1)` : 'rgba(240,240,225,0.9)'; ctx.lineWidth = 3; ctx.setLineDash([10, 6]); ctx.strokeRect(parkingLeft, parkingTop, parkingRight - parkingLeft, parkingBottom - parkingTop); ctx.setLineDash([]);
                    drawObstacle(ctx, leftObstacle, '#5a7a9a', '#3a5a7a', '#7a9aba'); drawObstacle(ctx, rightObstacle, '#8a5a5a', '#6a3a3a', '#aa7a7a');
                } else if (level === 1) {
                    const swTop = sideParkingTop - 20, swBottom = roadBottom + 20;
                    ctx.fillStyle = '#c8c8b8'; ctx.fillRect(0, swTop, W, roadTop - swTop); ctx.fillRect(0, roadBottom, W, swBottom - roadBottom);
                    ctx.fillStyle = '#4a4a42'; ctx.fillRect(0, roadTop, W, ROAD_WIDTH);
                    ctx.strokeStyle = '#f0f0e0'; ctx.lineWidth = 3; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(0, roadTop); ctx.lineTo(W, roadTop); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, roadBottom); ctx.lineTo(W, roadBottom); ctx.stroke();
                    ctx.setLineDash([18, 14]); ctx.strokeStyle = '#e8e8d0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, roadCenterY); ctx.lineTo(W, roadCenterY); ctx.stroke(); ctx.setLineDash([]);
                    ctx.fillStyle = successFlash > 0 ? `rgba(80,220,100,${0.15+0.25*successFlash})` : 'rgba(180,175,160,0.25)'; ctx.fillRect(sideParkingLeft, sideParkingTop, sideParkingRight - sideParkingLeft, sideParkingBottom - sideParkingTop);
                    ctx.strokeStyle = successFlash > 0 ? `rgba(${60+195*successFlash|0},${180+75*successFlash|0},${60+40*successFlash|0},1)` : 'rgba(240,240,225,0.9)'; ctx.lineWidth = 3; ctx.setLineDash([10, 6]); ctx.strokeRect(sideParkingLeft, sideParkingTop, sideParkingRight - sideParkingLeft, sideParkingBottom - sideParkingTop); ctx.setLineDash([]);
                    drawObstacle(ctx, frontObsSide, '#5a7a9a', '#3a5a7a', '#7a9aba'); drawObstacle(ctx, rearObsSide, '#8a5a5a', '#6a3a3a', '#aa7a7a');
                } else if (level === 2) {
                    ctx.fillStyle = '#4a4a42'; ctx.fillRect(lTurnH.x1, lTurnH.y1, lTurnH.x2 - lTurnH.x1, lTurnH.y2 - lTurnH.y1); ctx.fillRect(lTurnV.x1, lTurnV.y1, lTurnV.x2 - lTurnV.x1, lTurnV.y2 - lTurnV.y1);
                    ctx.strokeStyle = '#f0f0e0'; ctx.lineWidth = 3; ctx.setLineDash([]); ctx.strokeRect(lTurnH.x1, lTurnH.y1, lTurnH.x2 - lTurnH.x1, lTurnH.y2 - lTurnH.y1); ctx.strokeRect(lTurnV.x1, lTurnV.y1, lTurnV.x2 - lTurnV.x1, lTurnV.y2 - lTurnV.y1);
                    ctx.fillStyle = successFlash > 0 ? `rgba(80,220,100,${0.3+0.4*successFlash})` : 'rgba(80,200,80,0.3)'; ctx.beginPath(); ctx.arc(turnTargetX, turnTargetY, turnTargetR, 0, Math.PI * 2); ctx.fill();
                    ctx.strokeStyle = successFlash > 0 ? `rgba(80,255,100,${0.7*successFlash})` : 'rgba(200,200,200,0.5)'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
                } else if (level === 3) {
                    ctx.fillStyle = '#c8c8b8'; ctx.fillRect(0, roadTop - 20, W, 20); ctx.fillRect(0, roadBottom, W, 20);
                    ctx.fillStyle = '#4a4a42'; ctx.fillRect(0, roadTop, W, ROAD_WIDTH);
                    ctx.strokeStyle = '#f0f0e0'; ctx.lineWidth = 3; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(0, roadTop); ctx.lineTo(W, roadTop); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, roadBottom); ctx.lineTo(W, roadBottom); ctx.stroke();
                    ctx.setLineDash([18, 14]); ctx.strokeStyle = '#e8e8d0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, roadCenterY); ctx.lineTo(W, roadCenterY); ctx.stroke(); ctx.setLineDash([]);
                    drawObstacle(ctx, meetingCarObs, '#5a7a9a', '#3a5a7a', '#7a9aba');
                    ctx.fillStyle = successFlash > 0 ? `rgba(80,220,100,${0.2+0.3*successFlash})` : 'rgba(80,200,80,0.25)'; ctx.fillRect(meetingPassZone.x1, meetingPassZone.y1, meetingPassZone.x2 - meetingPassZone.x1, meetingPassZone.y2 - meetingPassZone.y1);
                    ctx.strokeStyle = successFlash > 0 ? `rgba(80,255,100,${0.6*successFlash})` : 'rgba(200,200,200,0.5)'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.strokeRect(meetingPassZone.x1, meetingPassZone.y1, meetingPassZone.x2 - meetingPassZone.x1, meetingPassZone.y2 - meetingPassZone.y1); ctx.setLineDash([]);
                } else if (level === 4) {
                    ctx.fillStyle = '#c8c8b8'; ctx.fillRect(0, roadTop - 20, W, 20); ctx.fillRect(0, roadBottom, W, 20);
                    ctx.fillStyle = '#4a4a42'; ctx.fillRect(0, roadTop, W, ROAD_WIDTH);
                    ctx.strokeStyle = '#f0f0e0'; ctx.lineWidth = 3; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(0, roadTop); ctx.lineTo(W, roadTop); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, roadBottom); ctx.lineTo(W, roadBottom); ctx.stroke();
                    ctx.setLineDash([18, 14]); ctx.strokeStyle = '#e8e8d0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, roadCenterY); ctx.lineTo(W, roadCenterY); ctx.stroke(); ctx.setLineDash([]);
                    drawObstacle(ctx, overtakeCarObs, '#8a5a5a', '#6a3a3a', '#aa7a7a');
                    ctx.fillStyle = successFlash > 0 ? `rgba(80,220,100,${0.3+0.4*successFlash})` : 'rgba(80,200,80,0.3)'; ctx.beginPath(); ctx.arc(overtakeEndZone.x, overtakeEndZone.y, overtakeEndZone.r, 0, Math.PI * 2); ctx.fill();
                    ctx.strokeStyle = successFlash > 0 ? `rgba(80,255,100,${0.7*successFlash})` : 'rgba(200,200,200,0.5)'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
                } else if (level === 5) {
                    const wideTop = roadCenterY - ROAD_WIDTH * 1.3, wideBottom = roadCenterY + ROAD_WIDTH * 1.3;
                    ctx.fillStyle = '#c8c8b8'; ctx.fillRect(0, wideTop - 20, W, 20); ctx.fillRect(0, wideBottom, W, 20);
                    ctx.fillStyle = '#4a4a42'; ctx.fillRect(0, wideTop, W, wideBottom - wideTop);
                    ctx.strokeStyle = '#f0f0e0'; ctx.lineWidth = 3; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(0, wideTop); ctx.lineTo(W, wideTop); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, wideBottom); ctx.lineTo(W, wideBottom); ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.fillStyle = successFlash > 0 ? `rgba(80,220,100,${0.2+0.3*successFlash})` : 'rgba(80,200,80,0.2)'; ctx.beginPath(); ctx.arc(uTurnZone.x, uTurnZone.y, uTurnZone.r, 0, Math.PI * 2); ctx.fill();
                    ctx.strokeStyle = successFlash > 0 ? `rgba(80,255,100,${0.6*successFlash})` : 'rgba(200,200,200,0.5)'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
                }
                drawCarOnCanvas(ctx);
            }

            function drawUI(ctx) {
                // 关卡指示器
                const dotR = 6, startX = W - 50, startY = 28, gap = 18;
                for (let i = 0; i < TOTAL_LEVELS; i++) {
                    ctx.beginPath(); ctx.arc(startX - i * gap, startY, dotR, 0, Math.PI * 2);
                    if (i === level) { ctx.fillStyle = 'rgba(255,220,80,0.9)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.stroke(); }
                    else { ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.stroke(); }
                }

                // 驾照分显示（只读）
                const licenseX = W - 32, licenseY = 60;
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                drawRoundedRect(ctx, licenseX - 45, licenseY - 8, 90, 18, 6);
                ctx.fill();
                ctx.fillStyle = '#f0c040';
                ctx.font = 'bold 10px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`🪪 ${licensePoints.toFixed(1)} / ${LICENSE_MAX}`, licenseX, licenseY + 5);

                // 相机按钮（恢复）
                const camX = W - 32, camY = 95, camR = 14;
                ctx.beginPath();
                ctx.arc(camX, camY, camR, 0, Math.PI * 2);
                ctx.fillStyle = cameraFollow ? 'rgba(100,200,255,0.7)' : 'rgba(255,255,255,0.25)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.6)';
                ctx.lineWidth = 2;
                ctx.stroke();
                // 内部图标（小圆+矩形）
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.beginPath();
                ctx.arc(camX, camY, camR * 0.3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(camX - camR * 0.45, camY - camR * 0.08, camR * 0.9, camR * 0.16);
            }

            function isOnCamBtn(px, py) {
                const camX = W - 32, camY = 95, camR = 14;
                return Math.hypot(px - camX, py - camY) < camR + 6;
            }

            function drawScene() {
                const ctx = sceneCtx;
                ctx.clearRect(0, 0, W, H);
                if (cameraFollow) {
                    ctx.save();
                    ctx.translate(W / 2, H / 2);
                    ctx.rotate(-carHeading - Math.PI / 2);
                    ctx.translate(-carX, -carY);
                    drawWorldElements(ctx);
                    ctx.restore();
                } else {
                    drawWorldElements(ctx);
                }
                drawUI(ctx);
            }

            function drawSteering() {
                const canvas = steeringCanvas, ctx = steeringCtx, size = canvas.width / (window.devicePixelRatio || 1), cx = size / 2, cy = size / 2, radius = size * 0.44;
                ctx.clearRect(0, 0, size, size);
                const grad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius); grad.addColorStop(0, '#3a3a38'); grad.addColorStop(0.7, '#2a2a28'); grad.addColorStop(1, '#1a1a18');
                ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 3; ctx.stroke();
                ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
                for (let i = 0; i < 36; i++) { const a = (i / 36) * Math.PI * 2 - Math.PI / 2, r1 = radius * 0.78, r2 = radius * 0.9; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); ctx.stroke(); }
                const pa = -Math.PI / 2 + steeringWheelAngle, pl = radius * 0.7, px = cx + Math.cos(pa) * pl, py = cy + Math.sin(pa) * pl;
                const pGrad = ctx.createLinearGradient(cx, cy, px, py); pGrad.addColorStop(0, '#e8c84a'); pGrad.addColorStop(1, '#f0d860'); ctx.fillStyle = pGrad; ctx.beginPath(); ctx.arc(px, py, radius * 0.16, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 2; ctx.stroke();
                ctx.fillStyle = '#555'; ctx.beginPath(); ctx.arc(cx, cy, radius * 0.12, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2; ctx.stroke();
            }

            function update(dt) {
                const cdt = Math.min(dt, 0.05);
                if (steeringActiveFingerId === null) {
                    if (keyState.a) { steeringWheelAngle -= KEY_STEER_SPEED * cdt; }
                    if (keyState.d) { steeringWheelAngle += KEY_STEER_SPEED * cdt; }
                    steeringWheelAngle = Math.max(-STEERING_MAX_RAD, Math.min(STEERING_MAX_RAD, steeringWheelAngle));
                    if (!keyState.a && !keyState.d && Math.abs(steeringWheelAngle) > 0.003) {
                        const ra = STEERING_RETURN_RATE * cdt;
                        if (Math.abs(steeringWheelAngle) <= ra) steeringWheelAngle = 0;
                        else steeringWheelAngle -= Math.sign(steeringWheelAngle) * ra;
                    }
                }
                steeringAngle = (steeringWheelAngle / STEERING_MAX_RAD) * FRONT_WHEEL_MAX_RAD; steeringAngle = Math.max(-FRONT_WHEEL_MAX_RAD, Math.min(FRONT_WHEEL_MAX_RAD, steeringAngle));
                const useThrottle = throttleActive || keyState.w;
                const useBrake = brakeActive || keyState.s;
                let af = 0; if (useThrottle && !useBrake) af = ACCELERATION; else if (useBrake && !useThrottle) af = -BRAKE_DECEL; else if (useBrake && useThrottle) af = -BRAKE_DECEL * 0.6; else { if (Math.abs(carSpeed) > 0.3) af = -Math.sign(carSpeed) * FRICTION; else carSpeed = 0; }
                carSpeed += af * cdt; carSpeed = Math.max(-MAX_SPEED_REVERSE, Math.min(MAX_SPEED_FORWARD, carSpeed));
                if (Math.abs(carSpeed) < 0.2 && !useThrottle && !useBrake) carSpeed = 0;
                const av = Math.abs(carSpeed) > 0.03 ? carSpeed / WHEELBASE * Math.tan(steeringAngle) : 0;
                carHeading += av * cdt; carX += carSpeed * Math.cos(carHeading) * cdt; carY += carSpeed * Math.sin(carHeading) * cdt;
                if (successTimer > 0) { successTimer -= cdt; successFlash = Math.max(0, successTimer / 1.8); if (successTimer <= 0) advanceLevel(); }
                if (failTimer > 0) { failTimer -= cdt; collisionFlash = Math.max(0, failTimer / 1.2); if (failTimer <= 0) resetCar(); }
                if (successTimer <= 0 && failTimer <= 0) {
                    if (checkSuccess()) { successTimer = 2.2; successFlash = 1; throttleActive = false; brakeActive = false; carSpeed = 0; }
                    if (checkObstacleCollision() && successTimer <= 0) { failTimer = 1.5; collisionFlash = 1; throttleActive = false; brakeActive = false; carSpeed = 0; }
                    if (checkOutOfBounds() && successTimer <= 0 && failTimer <= 0) { failTimer = 1.3; collisionFlash = 1; throttleActive = false; brakeActive = false; carSpeed = 0; }
                }
                if (collisionFlash > 0 && failTimer <= 0 && successTimer <= 0) collisionFlash = Math.max(0, collisionFlash - cdt * 3);
                if (successFlash > 0 && successTimer <= 0 && failTimer <= 0) successFlash = Math.max(0, successFlash - cdt * 3);
            }

            function gameLoop(ts) { const dt = lastTime ? (ts - lastTime) / 1000 : 0.016; lastTime = ts; update(dt); drawScene(); drawSteering(); requestAnimationFrame(gameLoop); }
            function getSteeringCenter() { const r = steeringCanvas.getBoundingClientRect(); return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 }; }
            function calcAngle(p) { const { cx, cy } = getSteeringCenter(); return Math.atan2(p.y - cy, p.x - cx); }

            // 相机按钮点击事件
            sceneCanvas.addEventListener('click', function(e) {
                const rect = sceneCanvas.getBoundingClientRect();
                const px = e.clientX - rect.left, py = e.clientY - rect.top;
                if (isOnCamBtn(px, py)) {
                    cameraFollow = !cameraFollow;
                }
            });
            sceneCanvas.addEventListener('touchend', function(e) {
                if (e.changedTouches.length === 1 && steeringActiveFingerId === null) {
                    const rect = sceneCanvas.getBoundingClientRect();
                    const px = e.changedTouches[0].clientX - rect.left, py = e.changedTouches[0].clientY - rect.top;
                    if (isOnCamBtn(px, py)) {
                        cameraFollow = !cameraFollow;
                        e.preventDefault();
                    }
                }
            });

            document.addEventListener('keydown', function(e) { const key = e.key.toLowerCase(); if (key === 'w' || key === 'a' || key === 's' || key === 'd') { e.preventDefault(); if (key === 'w') keyState.w = true; if (key === 'a') keyState.a = true; if (key === 's') keyState.s = true; if (key === 'd') keyState.d = true; } });
            document.addEventListener('keyup', function(e) { const key = e.key.toLowerCase(); if (key === 'w' || key === 'a' || key === 's' || key === 'd') { e.preventDefault(); if (key === 'w') keyState.w = false; if (key === 'a') keyState.a = false; if (key === 's') keyState.s = false; if (key === 'd') keyState.d = false; } });

            steeringCanvas.addEventListener('touchstart', function(e) { if (steeringActiveFingerId !== null || successTimer > 0 || failTimer > 0) return; const t = e.changedTouches[0]; steeringActiveFingerId = t.identifier; lastSteeringTouchAngle = normalizeAngle(calcAngle({ x: t.clientX, y: t.clientY })); e.preventDefault(); }, { passive: false });
            document.addEventListener('touchmove', function(e) { if (steeringActiveFingerId === null) return; for (let i = 0; i < e.changedTouches.length; i++) { const t = e.changedTouches[i]; if (t.identifier === steeringActiveFingerId) { const ca = normalizeAngle(calcAngle({ x: t.clientX, y: t.clientY })); let d = ca - lastSteeringTouchAngle; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; steeringWheelAngle += d; steeringWheelAngle = Math.max(-STEERING_MAX_RAD, Math.min(STEERING_MAX_RAD, steeringWheelAngle)); lastSteeringTouchAngle = ca; break; } } }, { passive: false });
            document.addEventListener('touchend', function(e) { if (steeringActiveFingerId === null) return; for (let i = 0; i < e.changedTouches.length; i++) { if (e.changedTouches[i].identifier === steeringActiveFingerId) { steeringActiveFingerId = null; break; } } });
            document.addEventListener('touchcancel', function(e) { if (steeringActiveFingerId === null) return; for (let i = 0; i < e.changedTouches.length; i++) { if (e.changedTouches[i].identifier === steeringActiveFingerId) { steeringActiveFingerId = null; break; } } });
            steeringCanvas.addEventListener('mousedown', function(e) { if (steeringActiveFingerId !== null || successTimer > 0 || failTimer > 0) return; steeringActiveFingerId = 'mouse'; lastSteeringTouchAngle = normalizeAngle(calcAngle({ x: e.clientX, y: e.clientY })); e.preventDefault(); });
            document.addEventListener('mousemove', function(e) { if (steeringActiveFingerId !== 'mouse') return; const ca = normalizeAngle(calcAngle({ x: e.clientX, y: e.clientY })); let d = ca - lastSteeringTouchAngle; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; steeringWheelAngle += d; steeringWheelAngle = Math.max(-STEERING_MAX_RAD, Math.min(STEERING_MAX_RAD, steeringWheelAngle)); lastSteeringTouchAngle = ca; });
            document.addEventListener('mouseup', function() { if (steeringActiveFingerId === 'mouse') steeringActiveFingerId = null; });

            function setupPedal(el, setActive) { el.addEventListener('touchstart', function(e) { if (successTimer > 0 || failTimer > 0) return; setActive(true); el.classList.add('active'); e.preventDefault(); }, { passive: false }); el.addEventListener('touchend', function() { setActive(false); el.classList.remove('active'); }); el.addEventListener('touchcancel', function() { setActive(false); el.classList.remove('active'); }); el.addEventListener('mousedown', function(e) { if (successTimer > 0 || failTimer > 0) return; setActive(true); el.classList.add('active'); e.preventDefault(); }); el.addEventListener('mouseup', function() { setActive(false); el.classList.remove('active'); }); el.addEventListener('mouseleave', function() { setActive(false); el.classList.remove('active'); }); }
            setupPedal(throttleBtn, (v) => { throttleActive = v; }); setupPedal(brakeBtn, (v) => { brakeActive = v; });
            document.addEventListener('gesturestart', function(e) { e.preventDefault(); }); document.addEventListener('gesturechange', function(e) { e.preventDefault(); }); document.addEventListener('gestureend', function(e) { e.preventDefault(); });
            lastTime = performance.now();
            requestAnimationFrame(gameLoop);
        })();
    </script>
</body>
</html>
