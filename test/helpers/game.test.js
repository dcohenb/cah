'use strict';

const _ = require('lodash');
const expect = require('expect.js');

const Player = require('.././Player');
const Game = require('.././Game');

describe('Game', () => {
    describe('Players in game', () => {
        var myGame = new Game();
        var player1 = new Player('player 1');
        var player2 = new Player('player 2');
        var player3 = new Player('player 3');
        var player4 = new Player('player 4');

        it('#playerJoin() should add the player to the waiting list', () => {
            myGame.playerJoin(player1);
            expect(myGame.waiting).to.contain(player1);
        });
        it('#playerLeave() Should remove the player from the waiting list and the playing list', () => {
            myGame.playerLeave(player1);
            expect(myGame.waiting).to.not.contain(player1);
            expect(myGame.playing).to.not.contain(player1);
        });
        it('#newRound() Should move all players from the waiting list to the playing list', () => {
            myGame.playerJoin(player1);
            myGame.playerJoin(player2);
            myGame.playerJoin(player3);
            expect(myGame.waiting).to.have.length(3);
            myGame.newRound();
            expect(myGame.waiting).to.have.length(0);
            expect(myGame.playing).to.have.length(3);
        });
        it('#playerLeave() Mid round, Not enough players game should be stopped, mode should be "setup"', () => {
            myGame.playerLeave(player1);
            expect(myGame.playing).to.have.length(2);
            expect(myGame.mode).to.be('setup');
        });
        it('#newRound() Not enough players - game mode should be "setup"', () => {
            myGame.newRound();
            expect(myGame.mode).to.be('setup');
        });
        it('#newRound() Enough players - game mode should be "playing"', () => {
            myGame.playerJoin(player1);
            myGame.newRound();
            expect(myGame.mode).to.be('playing');
        });
    });

    describe('Game from start to finish', () => {
        var myGame = new Game();
        var player1 = new Player('player 1');
        var player2 = new Player('player 2');
        var player3 = new Player('player 3');
        var player4 = new Player('player 4');

        player1.raiseScore();
        player2.raiseScore();

        it('player join should add all the players to the game and reset their score, do not start the game', () => {
            myGame.playerJoin(player1);
            myGame.playerJoin(player2);
            myGame.playerJoin(player3);
            myGame.playerJoin(player4);

            expect(player1.score).to.be(0);
            expect(player2.score).to.be(0);
            expect(player3.score).to.be(0);
            expect(player4.score).to.be(0);

            expect(myGame.waiting).to.have.length(4);
            expect(myGame.mode).to.be('setup');
        });

        it('New round should reset the game, add waiting players, draw cards & pick a judge', () => {
            myGame.newRound();

            // Waiting players should be added to the game
            expect(myGame.waiting).to.be.empty();
            expect(myGame.playing).to.not.be.empty();

            // All players should have cards
            myGame.playing.forEach(function (player) {
                expect(player.cards).to.have.length(6);
            });

            // A judge should be picked
            expect(_.find(myGame.playing, {judge: true})).to.be.a(Player);

            // A black card should be picked
            expect(myGame.question).to.be.a('string');

            // expectedAnswers should be set
            expect(myGame.expectedAnswers).to.be.above(0);

            expect(myGame.mode).to.be('playing');
        });
        it('After all players casted their votes the game should go to "judging" mode', () => {
            myGame.playing.forEach(function (player) {
                if (player.judge === false) {
                    myGame.castVote(player, _.sampleSize(player.cards, myGame.expectedAnswers));
                }
            });
            expect(myGame.mode).to.be('judging');
        });
        it('Judge vote should increase the selected players score', () => {
            myGame.judgeVote(player1);
            expect(player1.score).to.be(1);
        });
        it('New round should start automatically after judge casted a vote', () => {
            expect(myGame.mode).to.be('playing');
        });
    });
});