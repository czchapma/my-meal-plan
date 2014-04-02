from pyquery import PyQuery as pq

def parse_getportal():
	path = 'samples/getportal.html'
	d = pq(filename=path)
	d('tr')
parse_getportal()