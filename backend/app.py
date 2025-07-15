from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from datetime import datetime
from flasgger import Swagger
from flask_sqlalchemy import SQLAlchemy

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure PostgreSQL (replace with your actual DB URL)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/todo-db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define the Todo model (maps to PostgreSQL table)
class Todo(db.Model):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    due_date = db.Column(db.DateTime, nullable=True)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "dueDate": self.due_date.isoformat() if self.due_date else None,
            "completed": self.completed,
            "createdAt": self.created_at.isoformat()
        }

# Initialize database tables (run once)
with app.app_context():
    db.create_all()

# Swagger configuration (unchanged)
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec',
            "route": '/apispec.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/",
    "definitions": {
        "Todo": {
            "type": "object",
            "properties": {
                "id": {"type": "integer", "example": 1},
                "text": {"type": "string", "example": "Buy groceries"},
                "dueDate": {"type": "string", "format": "date-time", "example": "2023-12-31T23:59:59"},
                "completed": {"type": "boolean", "example": False},
                "createdAt": {"type": "string", "format": "date-time", "example": "2023-01-01T00:00:00"}
            }
        },
        "TodoInput": {
            "type": "object",
            "required": ["text"],
            "properties": {
                "text": {"type": "string", "example": "Learn Python"},
                "dueDate": {"type": "string", "format": "date-time", "example": "2023-12-31T23:59:59"}
            }
        }
    }
}
Swagger(app, config=swagger_config)

# API Routes
@app.route('/api/todos', methods=['GET'])
def get_todos():
    """
    Get all todos
    ---
    tags:
      - Todos
    responses:
      200:
        description: A list of todos
        schema:
          type: array
          items:
            $ref: '#/definitions/Todo'
    """
    todos = Todo.query.all()
    return jsonify([todo.to_dict() for todo in todos])

@app.route('/api/todos', methods=['POST'])
def create_todo():
    """
    Create a new todo
    ---
    tags:
      - Todos
    parameters:
      - in: body
        name: todo
        required: true
        schema:
          $ref: '#/definitions/TodoInput'
    responses:
      201:
        description: The created todo
        schema:
          $ref: '#/definitions/Todo'
      400:
        description: Invalid input
    """
    if not request.json or 'text' not in request.json:
        abort(400)
    
    new_todo = Todo(
        text=request.json['text'],
        due_date=datetime.fromisoformat(request.json['dueDate']) if 'dueDate' in request.json else None,
        completed=False
    )
    db.session.add(new_todo)
    db.session.commit()
    return jsonify(new_todo.to_dict()), 201

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """
    Update a todo
    ---
    tags:
      - Todos
    parameters:
      - name: todo_id
        in: path
        type: integer
        required: true
        example: 1
      - in: body
        name: todo
        required: true
        schema:
          $ref: '#/definitions/TodoInput'
    responses:
      200:
        description: The updated todo
        schema:
          $ref: '#/definitions/Todo'
      404:
        description: Todo not found
    """
    todo = Todo.query.get_or_404(todo_id)
    updates = request.json
    todo.text = updates.get('text', todo.text)
    todo.due_date = datetime.fromisoformat(updates['dueDate']) if 'dueDate' in updates else todo.due_date
    todo.completed = updates.get('completed', todo.completed)
    db.session.commit()
    return jsonify(todo.to_dict())

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """
    Delete a todo
    ---
    tags:
      - Todos
    parameters:
      - name: todo_id
        in: path
        type: integer
        required: true
        example: 1
    responses:
      200:
        description: Delete confirmation
        schema:
          type: object
          properties:
            result:
              type: boolean
              example: true
      404:
        description: Todo not found
    """
    todo = Todo.query.get_or_404(todo_id)
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'result': True})

if __name__ == '__main__':
    app.run(debug=True)