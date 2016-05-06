require('mocha')
require('should')
var path = require('path')
var request = require('supertest')
var express = require('express')
var app = express()
var bigpipe = require('../')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bigpipe({
  basedir: __dirname + '/public/'
}))

app.use(function(req, res, next) {
  if (req.path === '/') {
    res.bigpipe.write('hello')
  }
  
  if (req.path === '/render') {
    res.bigpipe.render('index', {
      info: 'hello bigpipe'
    })
  }
  
  if (req.path === '/pagelet_static') {
    res.bigpipe.render('index', { info: 'hello bigpipe' }).pagelet('pagelet.eg.js')
  }
  
  if (req.path === '/pagelet_render') {
    res.bigpipe
      .render('index', { info: 'hello bigpipe' })
      .render('pagelet', { info: 'this is pagelet' })
  }
})

describe('bigpipe', function() {
  describe('GET /', function() {
    it('should get hello', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .end(function(err, res){
          if (err) throw err;
          res.text.should.be.equal('hello')
          done()
        });
    })
  })
  
  describe('GET /render', function() {
    it('should get right html', function(done) {
      request(app)
        .get('/render')
        .expect(200)
        .expect('transfer-encoding', 'chunked')
        .end(function(err, res){
          if (err) throw err;
          res.text.should.be.equal('<!DOCTYPE html>\n<html>\n<head>\n    <meta charset=\"UTF-8\">\n    <title>test</title>\n</head>\n<body>\n    <h1>hello bigpipe</h1>  \n    <div id=\"container\"></div>\n    <script src=\"bigpipe.js\"></script>\n</body>\n</html>')
          done()
        });
    })
  })
  
  describe('GET /pagelet_static', function() {
    it('should get right html', function(done) {
      request(app)
        .get('/pagelet_static')
        .expect(200)
        .expect('transfer-encoding', 'chunked')
        .end(function(err, res){
          if (err) throw err;
          res.text.should.be.equal('<!DOCTYPE html>\n<html>\n<head>\n    <meta charset=\"UTF-8\">\n    <title>test</title>\n</head>\n<body>\n    <h1>hello bigpipe</h1>  \n    <div id=\"container\"></div>\n    <script src=\"bigpipe.js\"></script>\n</body>\n</html><script>__bigpipe_callback__(\'<h2>this is pagelet</h2>\')</script>')
          done()
        });
    })
  })
  
  describe('GET /pagelet_render', function() {
    it('should get right html', function(done) {
      request(app)
        .get('/pagelet_render')
        .expect(200)
        .expect('transfer-encoding', 'chunked')
        .end(function(err, res){
          if (err) throw err;
          res.text.should.be.equal('<!DOCTYPE html>\n<html>\n<head>\n    <meta charset=\"UTF-8\">\n    <title>test</title>\n</head>\n<body>\n    <h1>hello bigpipe</h1>  \n    <div id=\"container\"></div>\n    <script src=\"bigpipe.js\"></script>\n</body>\n</html><script>__bigpipe_callback__(\'this is pagelet\')</script>')
          done()
        });
    })
  })
  
})