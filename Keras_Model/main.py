from classifier import keras_model
import os
from PIL import Image
from skimage import data, transform
from skimage.color import rgb2gray
import numpy as np

def main():
  # Load images into a good and damaged numpy array
  PATH = "C:\\Users\\camer\\Documents\\Repositories\\SDHacks2018\\Keras_Model"
  TRAIN_DIR = os.path.join(PATH, "Training")
  TEST_DIR = os.path.join(PATH, "Testing")
  jpgtoppm(TRAIN_DIR)
  kmodel = keras_model()
  images, labels = kmodel.load_data(TRAIN_DIR)
  images28 = [transform.resize(image, (28, 28)) for image in images]
  length = len(images28)
  my_ary = np.zeros((length, 28, 28))
  for i, image in enumerate(images28):
    if image.shape == (28,28):
      my_ary[i,:,:] = image
    elif image.shape == (28,28,3):
      my_ary[i,:,:] = rgb2gray(image)
    else:
      print("Perhaps further issues with image set...")
      return
  images28 = my_ary
  input = images28.reshape(images28.shape[0], 1, 28, 28)
  for i, inp in enumerate(input):
    if labels[i] == 1:
      print(kmodel.predict(inp))
      print(i)

# Create 28 x 28 ppm files out of differently size jpgs
def jpgtoppm(data_directory):
    file_names = [data_directory + "\\Broken.jpg"]
    for f in file_names:
      image = Image.open(os.path.join(data_directory, f))
      newimage = image.resize((28, 28))
      newimage.save(data_directory + "\\Broken2.ppm")

if __name__ == "__main__":
  main()