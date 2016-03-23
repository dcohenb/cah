'use strict';

const cards = require('./Cards');

const CARDS_PER_PLAYER = 6;

class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.cards = [];
    }

    takeCards() {
        var missingCards = CARDS_PER_PLAYER - this.cards.length;
        this.cards = this.cards.concat(cards.getRandomWhite(missingCards));
    }

    resetScore() {
        this.score = 0;
    }

    raiseScore() {
        this.score += 1;
    }
}

module.exports = Player;