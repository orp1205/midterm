# Dockerfile for Nginx
FROM nginx:alpine

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy HTML files to the Nginx HTML directory
COPY . /usr/share/nginx

# Expose port 80
EXPOSE 80