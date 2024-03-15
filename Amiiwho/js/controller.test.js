const { JSDOM } = require('jsdom');
const { document } = new JSDOM().window;

global.document = document;
global.window = document.defaultView;
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

const {
  createSearches,
  makeLikeFunction,
  makeDeletion,
  checkDeleted,
} = require('./controller.js');

describe('createSearches function', () => {
  test('it should create a list of amiibos', () => {
    const mockData = {
      amiibo: [
        {
          name: 'Amiibo 1',
          character: 'Character 1',
          amiiboSeries: 'Series 1',
        },
        {
          name: 'Amiibo 2',
          character: 'Character 2',
          amiiboSeries: 'Series 2',
        },
      ],
    };
    document.body.innerHTML = '<ul id="searched"></ul>';
    createSearches(mockData);
    const listItems = document.querySelectorAll('#searched li');
    expect(listItems.length).toBe(2);
  });
});
