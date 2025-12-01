# Battle System Testing Guide

## Fixed Issues (This Session)

### 1. Turn Progression Bug
**Problem**: Menu would return to 'action' state immediately after player move, allowing rapid input spam before enemy turn executed.

**Solution**: Added a 'waiting' state that prevents input while the enemy turn is being calculated (1 second delay).

**Testing**: After selecting a move, the menu should be unresponsive for ~1 second while the enemy takes their turn.

### 2. Early Battle Termination
**Problem**: If enemy fainted during the setTimeout delay, the executeEnemyTurn() would still execute after the delay.

**Solution**: Added `waitingForEnemyTurn` flag to prevent delayed callback execution if battle already ended.

**Testing**: Defeat enemy in one hit - no error messages or duplicate turns should occur.

## Complete Battle Flow Test

### Prerequisites
- Game running at `http://127.0.0.1:8080`
- Browser console open (F12)
- On grassy area (should see encounters trigger every 5-25 steps)

### Step-by-Step Testing

#### 1. Trigger an Encounter
1. Open the game
2. Move your character on grass tiles (WASD or Arrow keys)
3. After 5-25 steps, battle should trigger automatically
4. **Expected**: See "A wild [Pokémon] appeared!" in battle log
5. **Expected**: See encounter popup with "Rattata Lv.3" or similar
6. **Console**: Should see "⚔️ Battle Scene initialized"

#### 2. Test Action Menu Navigation
1. Press **Left/Right arrows** to navigate between Fight/Switch/Item/Run
2. **Expected**: Selection should highlight (green background)
3. **Expected**: Must wait 200ms between inputs (input debouncing)
4. Press **Up/Down arrows** to cycle through actions
5. **Expected**: Wraps around (Fight → Run cycles back to Fight)

#### 3. Test Move Selection
1. Select "Fight" by pressing **Enter**
2. **Expected**: Menu switches to move selection (showing available moves)
3. **Expected**: See "Tackle (PP remaining)" or similar for each move
4. Press **Up/Down arrows** to navigate moves
5. **Expected**: Selection highlights correctly (green background)
6. Press **M** to cancel and return to action menu
7. **Expected**: Returns to action menu state

#### 4. Test Player Attack
1. Select "Fight" → Select "Tackle" → Press **Enter**
2. **Expected**: Battle log shows "Cyndaquil used Tackle! It's X damage!"
3. **Expected**: Enemy HP bar should decrease
4. **Expected**: Menu becomes unresponsive for ~1 second (waiting state)
5. **Expected**: No new input is accepted during this time
6. After ~1 second, battle log shows enemy action

#### 5. Test Enemy Turn
1. After player move, enemy should automatically respond with random move
2. **Expected**: Battle log shows "[Enemy] used [Move]! It's X damage!"
3. **Expected**: Your (player's) HP bar should decrease
4. **Expected**: Menu returns to action state (can input again)
5. Your turn should be ready

#### 6. Test Battle Continuation
1. Repeat 2-3 exchanges of attacks
2. **Expected**: HP values decrease each turn
3. **Expected**: Move PP decreases (shown in move menu as "PP/MaxPP")
4. **Expected**: Battle log maintains last 3 messages
5. **Expected**: Color-coded HP bars (green → yellow → red as HP drops)

#### 7. Test Victory Condition
1. Continue battle until enemy HP reaches 0
2. **Expected**: See "[Enemy name] fainted!"
3. **Expected**: See "Victory! You won the battle!"
4. **Expected**: Battle overlay appears saying "Battle Over!"
5. Press **Enter** to return to overworld
6. **Expected**: Game returns to overworld scene
7. **Expected**: Player position preserved

#### 8. Test Defeat Condition (Optional New Battle)
1. Trigger another encounter
2. Continue until your Cyndaquil's HP reaches 0
3. **Expected**: See "Cyndaquil fainted!"
4. **Expected**: See "Defeat! You lost the battle!"
5. **Expected**: Battle overlay appears
6. Press **Enter** to return to overworld
7. **Expected**: Game returns to overworld

#### 9. Test PP Depletion
1. In a long battle, keep using the same move
2. **Expected**: Move PP decreases each turn (Tackle: 35→34→33...)
3. **Expected**: When PP reaches 0, selecting that move shows "No PP left!"
4. **Expected**: Enemy can also run out of PP

## Console Verification

Open browser console (F12) and verify:

```
[On game start]
🎣 Encounter System initialized
🌍 Overworld Scene initialized

[On encounter trigger]
✅ Encounter triggered!
⚔️ Battle Scene initialized

[During battle - watch for proper logging]
- Player moves logged to battleLog
- Enemy moves logged to battleLog
- Damage calculations applied
```

## Known Limitations

- Only 1 Pokémon per team (no switching yet)
- Enemy AI is random move selection (no tactics)
- No type effectiveness visual indicator yet
- No status effects (burn, poison, etc.)
- No experience/leveling after battle

## Performance Baseline

- FPS should remain 60+ (visible in top-left corner as "FPS: XX")
- Battle transitions should be smooth (no lag during move execution)
- HP bar updates should be instant (visible immediately)

## Debugging Tips

1. **Menu not responding?**
   - Check console for "Battle Scene initialized" message
   - Verify you're not in 'waiting' state (wait 1 second after enemy turn)
   - Try pressing M to reset to action menu

2. **Damage not applying?**
   - Check console for attack messages
   - Verify enemy HP bar is visible (top-right)
   - Ensure move has power > 0 (status moves won't damage)

3. **Battle won't end?**
   - Check HP values in console: `game.currentScene.battleSystem.enemyActive.currentHp`
   - Verify faint condition: HP should be <= 0
   - Check for errors in console

4. **Encounter not triggering?**
   - Verify you're on grass tile (yellowish color)
   - Check console for "Steps: X/Y" messages
   - Ensure step count reaches threshold (5-25)
   - Try walking longer - first encounter threshold is random

## Quick Commands (Console)

```javascript
// Check current battle state
game.currentScene.battleSystem.playerActive
game.currentScene.battleSystem.enemyActive

// Check HP values
game.currentScene.battleSystem.playerActive.currentHp
game.currentScene.battleSystem.enemyActive.currentHp

// Get menu state
game.currentScene.currentMenuState

// Manually end battle (for testing)
game.currentScene.battleOver = true
```
