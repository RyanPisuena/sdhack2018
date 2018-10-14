from classifier import keras_model
import os
from PIL import Image

def main():
  # Load images into a good and damaged numpy array
  PATH = "C:\\Users\\camer\\Documents\\Repositories\\SDHacks2018\\Keras_Model"
  TRAIN_DIR = os.path.join(PATH, "Training")
  TEST_DIR = os.path.join(PATH, "Testing")
  jpgtoppm(os.path.join(TRAIN_DIR, "1"))
  #jpgtoppm(TEST_DIR)
  kmodel = keras_model()
  kmodel.setup_environment()


# Create 28 x 28 ppm files out of differently size jpgs
def jpgtoppm(data_directory):
    file_names = [os.path.join(data_directory, f) for f in data_directory
      if f.endswith(".ppm")]
    for f in file_names:
      image = Image.open(f)
      image.save("11{}.ppm".format(f[0:-4]))

if __name__ == "__main__":
  main()