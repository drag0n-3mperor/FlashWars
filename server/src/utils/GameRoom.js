import { combatTotalQuestions } from "../constants.js";

export default class GameRoom {
  constructor(player1, player2) {
    this.player1 = String(player1);
    this.player2 = String(player2);
    this.roomId =
      player1 < player2 ? `${player1}-${player2}` : `${player2}-${player1}`;

    this.status = {
      [this.player1]: [],
      [this.player2]: [],
    };

    this.points = {
      [this.player1]: 0,
      [this.player2]: 0,
    };

    this.flashcards = [];
  }

  getOpponent(player) {
    if (this.player1 === String(player)) return this.player2;
    if (this.player2 === String(player)) return this.player1;
    return null;
  }

  addFlashCards(flashcards) {
    this.flashcards = flashcards;
    this.clientFlashcards = flashcards.map((e, ind) => {
      return {
        ...e,
        correct_answer_index: null,
      };
    });
    console.log(this.clientFlashcards);
  }

  submitAnswer(player, answer, index) {
    const playerId = String(player);
    if (!this.status[playerId]) return false;

    const temp = this.status[playerId];

    if (temp.length < combatTotalQuestions) {
      this.status[playerId] = [
        ...temp,
        this.flashcards[index]?.answer === answer,
      ];
      this.points[playerId] += this.flashcards[index]?.answer === answer;
    }
    return this;
  }

  setWinner() {
    if (this.points[this.player1] === this.points[this.player2])
      return (this.winner = null);
    return (this.winner =
      this.points[this.player1] > this.points[this.player2]
        ? this.player1
        : this.player2);
  }

  toObject() {
    return {
      ...this,
      flashcards: null,
    };
  }

  toString() {
    return this.roomId;
  }
}
