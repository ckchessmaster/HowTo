import unittest, json
import azure.functions as func

from BlobTrigger import main # import the method we want to test
from unittest import mock

class TestBlobTrigger(unittest.TestCase):
  def test_blob_trigger(self):
    assert True == True