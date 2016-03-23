'use strict';

const expect = require('expect.js');
const Player = require('.././Player');

describe('Player', () => {
    var player1 = new Player('Player 1');

    it('Player constructor should set the player name', () => {
        expect(player1.name).to.be('Player 1');
    });

    it('#takeCards() Should complete the players cards to 6 cards', () => {
        player1.takeCards();
        expect(player1.cards).to.have.length(6);
    });

    it('All cards in the players deck should be valid strings', () => {
        player1.cards.forEach(function (card) {
            expect(card).to.be.a('string')
        });
    });

    it('#raiseScore() Should raise the player score by one', () => {
        player1.raiseScore();
        expect(player1.score).to.be(1);
        player1.raiseScore();
        expect(player1.score).to.be(2);
    });
});