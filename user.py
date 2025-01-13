import psycopg2
from psycopg2.extras import DictCursor

# Connect to your PostgreSQL database
connection = psycopg2.connect(
    dbname="postgres",
    user="postgres",
    password="Oluwaseun123",
    host="localhost",
    port="5432"
)
def get_workout_sessions(email):
    try:
        cursor = connection.cursor(cursor_factory=DictCursor)

        # SQL query to fetch workouts for the given email
        query = """
        SELECT id, workout_date AS date, type, duration_minutes AS duration, 
               calories_burned AS calories, accuracy_percentage AS accuracy
        FROM workouts
        WHERE user_email = %s;
        """

        # Execute the query
        cursor.execute(query, (email,))
        result = cursor.fetchall()

        # If no result, return an empty list
        if not result:
            return []

        # Format the result as a list of dictionaries
        workout_sessions = [
            {
                "id": str(row["id"]),
                "date": row["date"].strftime("%Y-%m-%d"),
                "type": row["type"],
                "duration": row["duration"],
                "calories": row["calories"],
                "accuracy": row["accuracy"]
            }
            for row in result
        ]
        return workout_sessions

    except Exception as e:
        print(f"An error occurred: {e}")
        return []


def get_user_progress(email):
    try:
        cursor = connection.cursor(cursor_factory=DictCursor)

        # SQL query to check if the user has progress data
        query = """
        SELECT
            workouts_completed,
            total_minutes,
            average_accuracy,
            streak
        FROM progress
        WHERE user_email = %s;
        """

        # Execute the query
        cursor.execute(query, (email,))
        result = cursor.fetchone()

        # If no result, return default progress
        if not result:
            return {
                "workoutsCompleted": 0,
                "totalMinutes": 0,
                "averageAccuracy": 0.0,
                "streak": 0
            }

        # Otherwise, return the fetched progress
        user_progress = {
            "workoutsCompleted": result["workouts_completed"],
            "totalMinutes": result["total_minutes"],
            "averageAccuracy": result["average_accuracy"],
            "streak": result["streak"]
        }

        return user_progress

    except Exception as e:
        print(f"An error occurred: {e}")
        return {
            "workoutsCompleted": 0,
            "totalMinutes": 0,
            "averageAccuracy": 0.0,
            "streak": 0
        }

def add_user_progress(email, workouts, minutes, accuracy, streak):
    try:
        cursor = connection.cursor()

        # SQL query to check if the user already has progress data
        check_query = "SELECT 1 FROM progress WHERE user_email = %s;"
        cursor.execute(check_query, (email,))
        user_exists = cursor.fetchone()

        if user_exists:
            print(workouts, minutes, accuracy, streak)
            # Update the existing user's progress
            update_query = """
            UPDATE progress
            SET
                workouts_completed = %s,
                total_minutes = %s,
                average_accuracy = %s,
                streak = %s
            WHERE user_email = %s;
            """
            cursor.execute(update_query, (workouts, minutes, accuracy, streak, email))
        else:
            # Insert a new user's progress
            insert_query = """
            INSERT INTO progress (
                user_email,
                workouts_completed,
                total_minutes,
                average_accuracy,
                streak
            ) VALUES (%s, %s, %s, %s, %s);
            """
            cursor.execute(insert_query, (email, workouts, minutes, accuracy, streak))

        # Commit the transaction
        connection.commit()

        return {"success": True, "message": "User progress updated successfully."}

    except Exception as e:
        print(f"An error occurred while adding/updating user progress: {e}")
        return {"success": False, "message": "Failed to update user progress."}
