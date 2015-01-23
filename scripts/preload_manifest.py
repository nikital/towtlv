#! /usr/bin/env python

from __future__ import print_function

import sys
import os
import json

def main():
    if len(sys.argv) < 4:
        print('Usage: {} output.js root dirs-to-scan...'.format(sys.argv[0]))
        return 1

    output_path = sys.argv[1]
    root = sys.argv[2]
    dirs_to_scan = sys.argv[3:]
    result = []

    for d in dirs_to_scan:
        for dirname, _, filenames in os.walk(d):
            for filename in filenames:
                full = os.path.join(dirname, filename)
                result.append(os.path.relpath(full, root))

    with open(output_path, 'w') as f:
        f.write('var preload_manifest = ')
        json.dump(result, f)
        f.write(';')

    return 0

if __name__ == '__main__':
    sys.exit(main())
