

prepare-tests:
	rm -rf build && \
	mkdir build && \
	cp -R ext/amdjs-tests build/ && \
	mkdir build/amdjs-tests/impl/require-tiny/

