'use strict';

const _ = require('lodash');
const cards = require('./Cards');

const MIN_PLAYERS = 3;

class Game {
    constructor() {
        this.mode = 'setup'; // [setup, round, judging]
        this.waiting = []; // Array of players waiting to join
        this.playing = []; // Array of players added during the last round
        this.previousBlackCards = []; // Array of cards already played
    }

    playerJoin(player) {
        player.resetScore();
        this.waiting.push(player);
    }

    playerLeave(player) {
        this.playing = _.without(this.playing, player);
        this.waiting = _.without(this.waiting, player);

        if (this.mode !== 'setup' && this.playing.length < MIN_PLAYERS) {
            if (this.waiting.length > 0) {
                this.newRound();
            } else {
                this.mode = 'setup';
            }
        }
    }

    newRound() {
        // Add waiting players
        this.playing = this.playing.concat(this.waiting);
        this.waiting = [];

        if (this.playing.length < MIN_PLAYERS) return 'Not enough players to start a new round';

        // Draw cards and pick reset judge status
        this.playing.forEach((player) => {
            player.vote = null;
            player.takeCards();
            player.judge = false;
        });

        // Pick the judge
        _.sample(this.playing).judge = true;

        // Pick question, Loop until a question that was not picked already shows up
        if (this.question) {
            this.previousBlackCards.push(this.question);
        }
        while (!this.question || this.previousBlackCards.indexOf(this.question) !== -1) {
            this.question = cards.getRandomBlack();
        }
        this.expectedAnswers = this.question.match(/(_)/g || []).length;

        // Set the Game.js mode
        this.mode = 'playing';
    }

    castVote(player, cards) {
        player.vote = cards;
        player.cards = _.without(player.cards, ...player.vote);
        
        var votes = this.playing.filter(function () {
            return player.judge || player.vote;
        }).length;

        // If everyone casted votes
        if (votes === this.playing.length) {
            this.mode = 'judging';
        }
    }

    judgeVote(player) {
        player.raiseScore();
        this.newRound();
    }
}
module.exports = Game;