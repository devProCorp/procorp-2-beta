import sys
with open(sys.argv[1],'w') as f: f.write(open(sys.argv[2]).read())
