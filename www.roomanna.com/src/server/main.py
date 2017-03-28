from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
import os
import logging

class MainHandler(webapp.RequestHandler):
  def get(self):
    file_handle = open('index.html', 'r')
    file_contents = file_handle.read()
    file_handle.close()
    self.response.headers["Content-Type"] = 'text/html'
    self.response.out.write(file_contents)

def main():
  application = webapp.WSGIApplication([
    ('/.*', MainHandler),
  ], debug=False)
  util.run_wsgi_app(application)

if __name__ == '__main__':  # pragma: no cover
  main()
