'use strict';

const expect = require('expect.js');
const cards = require('.././Cards');

describe('Cards', () => {
    describe('Black Cards', () => {
        describe('#getRandomBlack()', () => {
            var card = cards.getRandomBlack();

            it('black card should be a string', () => {
                expect(card).to.be.a('string');
            });

            it('black cards should have at least one placeholder', () => {
                var count = card.match(/(_)/g || []).length;
                expect(count).to.be.greaterThan(0);
            });
        });
    });

    describe('White Cards', function () {
        describe('#getRandomWhite()', function () {
            var whiteCards = cards.getRandomWhite();

            it('white cards should be an array with 1 element', () => {
                expect(whiteCards).to.be.an('array');
                expect(whiteCards).to.have.length(1);
            });

            it('white cards inside the array should all be strings', () => {
                whiteCards.forEach((card) => {
                    expect(card).to.be.a('string');
                });
            });
        });

        describe('#getRandomWhite(3)', () => {
            var whiteCards = cards.getRandomWhite(3);

            it('white cards should be an array with 3 elements', () => {
                expect(whiteCards).to.be.an('array');
                expect(whiteCards).to.have.length(3);
            });

            it('white cards inside the array should all be strings', () => {
                whiteCards.forEach((card) => {
                    expect(card).to.be.a('string');
                });
            });
        });
    });
});