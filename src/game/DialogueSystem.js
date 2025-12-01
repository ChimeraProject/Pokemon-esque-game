/**
 * DialogueSystem - Handles NPC dialogue display and interaction
 */
export class DialogueSystem {
  constructor(scene) {
    this.scene = scene;
    this.isActive = false;
    this.currentDialogue = [];
    this.currentIndex = 0;
    this.dialogueBox = null;
    this.dialogueText = null;
    this.onComplete = null;
  }

  /**
   * Show a dialogue box with text
   * @param {Array<string>} dialogue - Array of dialogue strings
   * @param {Function} onComplete - Callback when dialogue ends
   */
  showDialogue(dialogue, onComplete = null) {
    if (this.isActive) return;
    
    this.isActive = true;
    this.currentDialogue = dialogue;
    this.currentIndex = 0;
    this.onComplete = onComplete;
    
    this.createDialogueBox();
    this.displayCurrentText();
  }

  /**
   * Create the dialogue box UI
   */
  createDialogueBox() {
    const { width, height } = this.scene.scale;
    const boxHeight = 50;
    const boxY = height - boxHeight - 5;
    const boxX = 5;
    const boxWidth = width - 10;
    
    // Create background box
    this.dialogueBox = this.scene.add.graphics();
    this.dialogueBox.fillStyle(0x000000, 0.85);
    this.dialogueBox.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 5);
    this.dialogueBox.lineStyle(2, 0xffffff, 1);
    this.dialogueBox.strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 5);
    this.dialogueBox.setDepth(100);
    this.dialogueBox.setScrollFactor(0);
    
    // Create text
    this.dialogueText = this.scene.add.text(boxX + 10, boxY + 10, '', {
      fontSize: '10px',
      color: '#ffffff',
      wordWrap: { width: boxWidth - 20 },
      lineSpacing: 4
    });
    this.dialogueText.setDepth(101);
    this.dialogueText.setScrollFactor(0);
    
    // Create continue indicator
    this.continueIndicator = this.scene.add.text(
      boxX + boxWidth - 20,
      boxY + boxHeight - 15,
      '▼',
      { fontSize: '10px', color: '#ffffff' }
    );
    this.continueIndicator.setDepth(101);
    this.continueIndicator.setScrollFactor(0);
    
    // Add blinking animation
    this.scene.tweens.add({
      targets: this.continueIndicator,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
  }

  /**
   * Display current dialogue text
   */
  displayCurrentText() {
    if (this.currentIndex < this.currentDialogue.length) {
      this.dialogueText.setText(this.currentDialogue[this.currentIndex]);
    }
  }

  /**
   * Advance to next dialogue line
   */
  advance() {
    if (!this.isActive) return;
    
    this.currentIndex++;
    
    if (this.currentIndex >= this.currentDialogue.length) {
      this.hideDialogue();
    } else {
      this.displayCurrentText();
    }
  }

  /**
   * Hide the dialogue box
   */
  hideDialogue() {
    this.isActive = false;
    
    if (this.dialogueBox) {
      this.dialogueBox.destroy();
      this.dialogueBox = null;
    }
    
    if (this.dialogueText) {
      this.dialogueText.destroy();
      this.dialogueText = null;
    }
    
    if (this.continueIndicator) {
      this.continueIndicator.destroy();
      this.continueIndicator = null;
    }
    
    if (this.onComplete) {
      this.onComplete();
      this.onComplete = null;
    }
  }

  /**
   * Check if dialogue is currently showing
   */
  isDialogueActive() {
    return this.isActive;
  }
}
