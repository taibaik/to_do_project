import webview

# data
tasks = []
task_id = 1


# backend
class API:
    def init_ui(self):
        return tasks

    def add_task(self, text):
        global task_id

        if not text.strip():
            return tasks

        tasks.append({
            "id": task_id,
            "text": text,
            "done": False,
            "flagged": False
        })

        task_id += 1
        return tasks

    def delete_task(self, task_id_param):
        global tasks
        tasks = [t for t in tasks if t["id"] != task_id_param]
        return tasks

    def toggle_task(self, task_id_param):
        for t in tasks:
            if t["id"] == task_id_param:
                t["done"] = not t["done"]
                break
        return tasks

    def toggle_flag(self, task_id_param):
        for t in tasks:
            if t["id"] == task_id_param:
                t["flagged"] = not t["flagged"]
                break
        return tasks


# run
if __name__ == "__main__":
    api = API()

    webview.create_window(
        "Reminders App",
        "index.html",
        js_api=api
    )

    webview.start()