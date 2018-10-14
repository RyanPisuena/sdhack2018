from classifier import keras_model
import os
from PIL import Image
from skimage import data

def main():
  # Load images into a good and damaged numpy array
  PATH = "C:\\Users\\camer\\Documents\\Repositories\\SDHacks2018\\Keras_Model"
  TRAIN_DIR = os.path.join(PATH, "Training")
  TEST_DIR = os.path.join(PATH, "Testing")
  jpgtoppm(TRAIN_DIR)
  kmodel = keras_model()
  broken = data.imread(TRAIN_DIR + "\\Broken2.ppm")
  car = data.imread("Fixed.ppm")
  print(kmodel.predict([broken]))
  print(kmodel.predict([car]))

# Create 28 x 28 ppm files out of differently size jpgs
def jpgtoppm(data_directory):
    file_names = [data_directory + "\\Broken.jpg"]
    for f in file_names:
      image = Image.open(os.path.join(data_directory, f))
      newimage = image.resize((28, 28))
      newimage.save(data_directory + "\\Broken2.ppm")

if __name__ == "__main__":
  main()