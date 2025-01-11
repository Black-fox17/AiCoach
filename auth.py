import psycopg2

db_params = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "Oluwaseun123",
    "host": "localhost",  
}

def insert_data(full_name, email, password):
    insert_query = """
        INSERT INTO ai_auth (full_name,email, password)
        VALUES (%s, %s, %s)
    """
    data = (full_name,email, password)
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute(insert_query, data)
                conn.commit()
                print("Data added successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")

def get_all_data():
    get_query = "SELECT email FROM ai_auth;"
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute(get_query)
                results = cursor.fetchall()
                email_list = [row[0] for row in results]
                print("Data retrieved successfully.")
                return email_list
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

def get_signin_info():
    get_query = "SELECT email, password, full_name FROM ai_auth;"
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute(get_query)
                results = cursor.fetchall()
                print("Signin info retrieved successfully.")
                return results
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

# print(get_signin_info())