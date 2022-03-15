const request = require('supertest');
const { getAllPosts } = require('../../controllers/posts');
// const posts = require('../../models/Post');
// const posts = require("../../routes/posts")
// const server = require("../../server")
const mockData = require("../mockData/posts.json")

// const posts = require("./")
describe('Get all Posts', () => {
  it('GET /posts/all should return all posts', () => {
    return request(mockData)
      .get('/posts/all')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: expect.any(String),
              text: expect.any(String),
              name: expect.any(String),
              user: expect.any(String),
              likes: expect.any(Array),
              comments: expect.any(Array),
              date: '2022-03-01T20:52:35.979Z'
            })
          ])
        );
      });
  });

describe('Get all Profiles', () => {
  it('GET /profiles/all should return all profiles', () => {
    return request(mockData)
      .get('/posts/all')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: expect.any(String),
              user: expect.any(String),
              website: expect.any(String),
              skills: expect.any(Array),
              date: '2022-03-01T20:52:35.979Z'
            })
          ])
        );
      });
  });

  it('POST /profile/new should add new profile ', () => {});
  it('POST /posts/new should new post ', () => {});
})
