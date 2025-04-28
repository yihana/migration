require('dotenv').config();

module.exports = {
  notionToken: process.env.NOTION_TOKEN,
  databaseId: process.env.NOTION_DATABASE_ID
};
