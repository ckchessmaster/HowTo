import unittest, json
import azure.functions as func

from HelloWorld import main # import the method we want to test
from unittest import mock

# Note how the class name starts with Test
class TestHelloWorld(unittest.TestCase):

  # Note how the test case starts with test_
  def test_hello_world(self):
    # Arrange
    request = func.HttpRequest(
      method='GET',
      url='/api/helloworld',
      params={ 'name': 'chris' },
      body=None
    )

    output_blob = mock.Mock()

    # Act
    response = main(request, output_blob)

    # Assert

    # Assert we have a success code
    assert response.status_code == 200

    # Assert the response is as expected
    assert 'Blob for user chris' in response.get_body().decode() 
    
    # Assert that the blob actually got set
    output_blob.set.assert_called()

  def test_hello_world_post(self):
    # Arrange
    request = func.HttpRequest(
      method='POST',
      url='/api/helloworld',
      body=json.dumps({
        'name': 'chris'
      }).encode('utf8')
    )

    output_blob = mock.Mock()

    # Act
    response = main(request, output_blob)

    # Assert

    # Assert we have a success code
    assert response.status_code == 200

    # Assert the response is as expected
    assert 'Blob for user chris' in response.get_body().decode() 
    
    # Assert that the blob actually got set
    output_blob.set.assert_called()

  def test_no_name(self):
    # Arrange
    request = func.HttpRequest(
      method='POST',
      url='/api/helloworld',
      body=json.dumps({}).encode('utf8'),
      params={},
    )

    output_blob = mock.Mock()

    # Act
    response = main(request, output_blob)

    # Assert

    # Assert we have a success code
    assert response.status_code == 200

    # Assert the response is as expected
    assert 'Pass a name in the query string or in the request body' in response.get_body().decode() 
    
    # Assert that the blob does not get created
    output_blob.set.assert_not_called()