

prepare-tests:
	rm -rf build && \
	mkdir build && \
	cp -R ext/amdjs-tests build/ && \
	mkdir build/amdjs-tests/impl/require-tiny/ && \
	cp src/require-tiny.js build/amdjs-tests/impl/require-tiny/require.js && \
	cp config.js build/amdjs-tests/impl/require-tiny/


