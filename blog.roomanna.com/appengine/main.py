from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
import os
import logging

CONTENT_TYPES = {
  'html' : 'text/html',
  'css' : 'text/css',
  'jpg' : 'image/jpeg',
  'png' : 'image/png',
  'ttf' : 'font/ttf',
  'otf' : 'font/otf',
}
class MainHandler(webapp.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), '_site', self.request.path[1:])
    logging.info('Path requested: %s' % path)
    if os.path.isdir(path):
      logging.info('Trying to get directory: %s' % path)
      path = os.path.join(path, 'index.html')
    if os.path.isfile(path):
      logging.info('Trying to get file: %s' % path)
      file_handle = open(path, 'r')
      file_contents = file_handle.read()
      file_handle.close()
      file_ext = path.split('.')[-1]
      if CONTENT_TYPES.has_key(file_ext):
        self.response.headers["Content-Type"] = CONTENT_TYPES[file_ext]
      self.response.out.write(file_contents)

def main():  # pragma: no cover
  application = webapp.WSGIApplication([
    ('/.*', MainHandler),
  ], debug=False)
  util.run_wsgi_app(application)

if __name__ == '__main__':  # pragma: no cover
  main()