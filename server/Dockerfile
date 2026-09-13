FROM node:20-bookworm

# Install LaTeX / pdflatex
RUN apt-get update && \
    apt-get install -y \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-latex-extra \
    fonts-font-awesome \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies first
COPY package*.json ./
RUN npm ci

# Copy backend source
COPY . .

EXPOSE 5000

CMD ["npm", "start"]