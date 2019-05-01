import sys

import imageio

uniques = {}

for fn in sys.argv[1:]:
    image = str(imageio.imread(fn))
    uniques[image] = fn

for k in uniques.values():
    print k

#print len(unique.values())
