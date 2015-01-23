TSC = tsc

TS_FILES := $(shell find ts -type f -iname '*.ts')
PRELOAD_DIRS := assets
PRELOAD_FILES := $(shell find $(PRELOAD_DIRS) -type f)

.PHONY: all clean watch server

all: js/main.js js/preload_manifest.js

js/main.js: ts/main.ts $(TS_FILES)
	$(TSC) -t ES5 --out $@ $<

js/preload_manifest.js: $(PRELOAD_FILES)
	./scripts/preload_manifest.py $@ . $(PRELOAD_DIRS)

clean:
	-rm js/main.js js/preload_manifest.js

watch:
	fswatch -l 0.3 -o ts | while read; do make && echo OK; done

server:
	python -m SimpleHTTPServer 8989
