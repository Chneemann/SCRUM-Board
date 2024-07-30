from django.test import TestCase

# Create your tests here.
class TaskTest(TestCase):
    def test_task_page(self):
        response = self.client.get("/tasks/")
        self.assertEqual(response.status_code, 200)