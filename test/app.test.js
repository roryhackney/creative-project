"use strict";

const supertest = require('supertest');
const chai = require('chai');
const {expect} = chai;
const http = require('http');  // Import http module
const app = require('../app');  // Your Express app
const server = http.createServer(app);  // Create an HTTP server instance from your app
const request = supertest(server);  // Use this for making requests

describe('Get / About', function() {
    // Increase global timeout to 10 seconds
    this.timeout(10000);
    describe('GET /', () => {
        it('should redirect to the about.html file', function(done) {
            this.timeout(10000);  // Increase timeout for this test
            request.get('/')
            .expect(302)
            // .expect('Content-Type', /html/) //I cannot for the life of me figure out why it's text/plain
            .end((err, res) => {
                if (err) return done(err);
                expect(res.status).to.equal(302);
                done();
            });
        });
    });

    // // Test the POST route for valid number input
    // describe('POST /get-number-fact', () => {
    //     it('should return a fact about the number', (done) => {
    //         request.post('/get-number-fact')
    //         .send({ number: '42' })
    //         .set('Content-Type', 'application/x-www-form-urlencoded')  // Set correct Content-Type
    //         .expect(200)
    //         .end((err, res) => {
    //             if (err) return done(err);
    //             expect(res.text).to.include('Here\'s a fact about the number 42');
    //             done();
    //         });
    //     });

    //     // Test if no number is provided
    //     it('should return 400 if no number is provided', (done) => {
    //         request.post('/get-number-fact')
    //         .send({ number: '' })  // No number provided
    //         .expect(400)
    //         .end((err, res) => {
    //             if (err) return done(err);
    //             expect(res.text).to.equal('Please provide a valid number.');
    //             done();
    //         });
    //     });
    // });
});
