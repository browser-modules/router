BROWSERIFY=./node_modules/.bin/browserify
DOX_GITHUB=./node_modules/.bin/dox-github
DOX=./node_modules/.bin/dox

all: build/Router.js README.md

README.md: src/Router.js
	$(DOX) < $< | $(DOX_GITHUB) > $@

build/Router.js: src/Router.js
	mkdir -p $(@D)
	$(BROWSERIFY) $< > $@

debug/Router.js: src/Router.js
	mkdir -p $(@D)
	$(BROWSERIFY) --debug $< > $@

clean:
	rm -rf build/*
	rm README.md

.PHONY: all clean