FROM python:3.11-slim

WORKDIR /app

# Install uv for ultra-fast dependency management
RUN pip install --no-cache-dir uv

# Copy project definition files
COPY pyproject.toml uv.lock ./

# Install dependencies using uv
RUN uv sync --frozen || uv sync

# Copy application source
COPY . .

EXPOSE 8000

CMD ["uv", "run", "fastapi", "run", "main.py", "--port", "8000", "--host", "0.0.0.0"]
