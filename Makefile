nginx:
	docker run -d -p "8000:8000" --name nginx --network server_default \
		-v ${PWD}/dist:/usr/share/nginx/html:ro \
		-v ${PWD}/nginx.conf:/etc/nginx/nginx.conf:ro \
		nginx:1.25-alpine3.18

.PHONY: nginx