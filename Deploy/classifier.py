# @ file classifier.py

# Dependencies
import numpy as np
import os
from skimage import data, transform
from skimage.color import rgb2gray
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Flatten
from keras.layers import Conv2D, MaxPooling2D
from keras.utils import np_utils
import matplotlib.pyplot as plt
import re

class keras_model:
  # Setup
  def __init__(self):
    np.random.seed(1234)
    self.model = Sequential()
    self.__setup_environment()

  # Load in 28 x 28 ppm files
  def load_data(self, data_directory):
    directories = [d for d in os.listdir(data_directory) if os.path.isdir(os.path.
      join(data_directory, d))]
    labels = []
    images = []
    for d in directories:
      label_directory = os.path.join(data_directory, d)
      file_names = [os.path.join(label_directory, f) for f in os.listdir
        (label_directory) if f.endswith(".ppm")]
      for f in file_names:
        images.append(data.imread(f))
        labels.append(int(d))
    return images, labels

  def predict(self, input):
    images = self.__transform_from_json(input)
    images28 = [transform.resize(image, (28, 28)) for image in images]
    length = len(images28)
    my_ary = np.zeros((length, 28, 28))
    for i, image in enumerate(images28):
      if image.shape == (28,28):
        my_ary[i,:,:] = image
      elif image.shape == (28,28,3):
        my_ary[i,:,:] = rgb2gray(image)
      else:
        print("Problem with data.")
        return
    images28 = my_ary
    model_input = images28.reshape(images28.shape[0], 1, 28, 28)
    return self.model.predict_classes(model_input)

###################Private Functions############################################

  # Set up model
  def __SetUpModel(self):
    self.model.add(Conv2D(32, 3, 3, activation='relu', input_shape=(1, 28, 28),
      dim_ordering='th'))
    self.model.add(Conv2D(32, 3, 3, activation='relu'))
    self.model.add(MaxPooling2D(pool_size=(2,2)))
    self.model.add(Dropout(0.25))
    self.model.add(Flatten())
    self.model.add(Dense(128, activation='relu'))
    self.model.add(Dropout(0.5))
    self.model.add(Dense(2, activation='softmax'))
    self.model.compile(loss='categorical_crossentropy',
      optimizer='adam', metrics=['accuracy'])

  # Set up the environment and runs the convolutional neural network
  def __setup_environment(self):
    # Load images into a good and damaged numpy array
    PATH = "C:\\Users\\camer\\Documents\\Repositories\\SDHacks2018\\Deploy"
    TRAIN_DIR = os.path.join(PATH, "Training")
    images, labels = self.load_data(TRAIN_DIR)
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
    self.__SetUpModel()
    labels = np_utils.to_categorical(labels, 2)
    self.model.fit(input, labels, batch_size=32, nb_epoch=10, verbose=1)

  def __transform_from_json(self, input):
    dim1list = []
    dim2list = []
    dim3list = []
    dim4list = []
    current_dim = 4
    for letter in input:
      if letter == '[':
        current_dim -= 1
      elif letter == ']':
        if current_dim == 4:
          return dim4list
        elif current_dim == 3:
          dim4list.append(dim3list)
          dim3list.clear()
        elif current_dim == 2:
          dim3list.append(dim2list)
          dim2list.clear()
        else:
          dim2list.append(dim1list)
          dim1list.clear()
        current_dim += 1
      else:
        m = re.search(letter, '\d')
        if len(m) > 0:
          if current_dim == 4:
            dim4list.append(m)
          elif current_dim == 3:
            dim3list.append(m)
          elif current_dim == 2:
            dim2list.append(m)
          else:
            dim1list.append(m)
          









    return outerlist