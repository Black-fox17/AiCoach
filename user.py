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

        # Format the result as a list of dictionaries
        workout_sessions = [
            {
                "id": str(row["id"]),
                "date": row["date"].strftime("%Y-%m-%d"),  # Format date as a string
                "type": row["type"],
                "duration": row["duration"],
                "calories": row["calories"],
                "accuracy": row["accuracy"]
            }
            for row in result
        ]
        cursor.close()
        connection.close()
        return workout_sessions
    
    except Exception as e:
        print(f"An error occurred: {e}")
        return []


def get_user_progress(email):
    try:
        cursor = connection.cursor(cursor_factory=DictCursor)

        # SQL queries to calculate progress
        query = """
        SELECT
            workouts_completed,
            total_minutes,
            average_accuracy AS average_accuracy,  -- Convert to percentage
            streak
        FROM progress
        WHERE user_email = %s;
        """


        # Execute the query
        cursor.execute(query, (email,))
        result = cursor.fetchone()

        
        user_progress = {
            "workoutsCompleted": result["workouts_completed"],
            "totalMinutes": result["total_minutes"],
            "averageAccuracy": result["average_accuracy"],  # Already rounded
            "streak": result["streak"]
        }

        cursor.close()
        connection.close()
        return user_progress

    except Exception as e:
        print(f"An error occurred: {e}")
        return {}


# Example usage
# email = "ayeleru1234@gmail.com"
# workout_sessions = get_user_progress(email)
# print(workout_sessions)
