from functools import wraps

from flask import jsonify, session


def login_required(view_function):
    @wraps(view_function)
    def wrapped_view(*args, **kwargs):
        user_id = session.get("user_id")

        if user_id is None:
            return jsonify(
                {
                    "error": "Authentication required."
                }
            ), 401

        return view_function(*args, **kwargs)

    return wrapped_view