import apiClient from "utils/apiClient";
import Swal from "sweetalert2";
import { ADMIN_USER_DATA } from "utils/constant";
import { validateFormRules } from "utils/useForm";
import Router from "next/router";

const initialState = {
  featureFlagList: [],
  model_edit: {},
  isLoading: false,
  isDataLoaded: false,
  error: {},
  pilotIds: [],
};

const actions = {
  ADD_DATA_LIST: "new/featureFlags/Add_Data",
  ADD_NAME_DATA: "new/featureFlags/add_Name_Data",
  CHANGE_INPUT_VALUE: "new/featureFlags/name",
  CREATE_NEW_FEATURE_EMT: "new/featureFlags/create_new_Emt",
  CHANGE_INPUT_PILOT_VALUE: "new/featureFlags/create_pilot_ids",
  RESET_FROM_ERROR: "new/featureFlags/resetFromError",
  SET_FROM_ERROR: "new/featureFlags/setFromError",
  ADD_PILOT_IDS: "new/featureFlags/pilotIds",
};

const featureFlagFormRules = {
  name: {
    required: {
      value: true,
      message: "Please Enter the Name",
    },
  },

  description: {
    required: {
      value: true,
      message: "Enter valid description",
    },
  },

  status: {
    required: {
      value: true,
      message: "select required status",
    },
  },

  pilotType: {
    custom: {
      message: "",
      isValid: function (pilotType, data) {
        if (data.status == "pilot" && !pilotType) {
          this.message = "please select required pilot type";
          return false;
        }
        this.message = "";
        return true;
      },
    },
  },

  pilotIds: {
    custom: {
      message: "",
      isValid: function (pilotIds, data) {
        if (data.status == "pilot" && !pilotIds?.length) {
          this.message = "please select given userIds";
          return false;
        }
        this.message = "";
        return true;
      },
    },
  },
};

export const addDataFeatureFlag = (data) => {
  return {
    type: actions.ADD_DATA_LIST,
    data,
  };
};

export const createFeatureItem = () => {
  return {
    type: actions.CREATE_NEW_FEATURE_EMT,
    payload: {
      name: "",
      description: "",
      status: "",
      pilotType: "",
      pilotIds: [],
    },
  };
};

export const resetError = () => {
  return {
    type: actions.RESET_FROM_ERROR,
  };
};

export const setError = (data) => {
  return {
    type: actions.SET_FROM_ERROR,
    payload: {
      ...data,
    },
  };
};

export const changeInputName = (key: any, value: any) => {
  if (value === "pilot") {
    return {
      type: actions.CHANGE_INPUT_VALUE,
      payload: {
        [key]: value,
        pilotType: "user",
        pilotIds: [],
      },
    };
  }
  return {
    type: actions.CHANGE_INPUT_VALUE,
    payload: {
      [key]: value,
    },
  };
};

export const fetchPilotIDS = () => async (dispatch, getState) => {
  try {
    const response = await apiClient.get(`${ADMIN_USER_DATA}/users`, {}, true);
    if (response.success) {
      const data = response.data.map((e) => `${e.name}  (${e.id})`);
      dispatch({
        type: actions.ADD_PILOT_IDS,
        data: data,
      });
    } else {
      Swal.fire({
        title: "error",
        icon: "error",
        showCloseButton: true,
        cancelButtonText: "Ok",
        timer: 3000,
        html: response.message,
      });
    }
  } catch (e) {
    Swal.fire({
      title: "error",
      icon: "error",
      showCloseButton: true,
      cancelButtonText: "Ok",
      timer: 3000,
      html: e.message,
    });
  }
};

export const fetchFeatureFlags = (loader) => async (dispatch, getState) => {
  loader(true);
  try {
    const response = await apiClient.get(ADMIN_USER_DATA);
    const data = await response.data;
    dispatch(addDataFeatureFlag(data));
    dispatch(fetchPilotIDS());
    loader(false);
  } catch (e) {
    loader(false);
    Swal.fire({
      title: "error",
      icon: "error",
      showCloseButton: true,
      cancelButtonText: "Ok",
      timer: 3000,
      html: e.message,
    });
  }
};

export const fetchNameFeatureFlags =
  (name, loader) => async (dispatch, getState) => {
    loader(true);
    try {
      const response = await apiClient.get(
        `${ADMIN_USER_DATA}/name?name=${name}`,
        {},
        true
      );
      if (response.success) {
        loader(false);
        dispatch({
          type: actions.ADD_NAME_DATA,
          data: response.data,
        });
        Router.push({
          pathname: "/admin/featureFlags",
          query: { type: "edit", name: name },
        });
      } else {
        Swal.fire({
          title: "error",
          icon: "error",
          showCloseButton: true,
          cancelButtonText: "Ok",
          timer: 3000,
          html: response.message,
        });
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        icon: "error",
        showCloseButton: true,
        cancelButtonText: "Ok",
        timer: 3000,
        html: e.message,
      });
    }
  };

export const deleteFalgItem =
  (name: any, loader) => async (dispatch, getState) => {
    loader(true);
    try {
      const response = await apiClient.delete(
        `${ADMIN_USER_DATA}`,
        { name },
        true
      );
      if (response.success === true) {
        loader(false);
        Swal.fire({
          title: "Successfully deleted ",
          icon: "success",
          showCloseButton: true,
          cancelButtonText: "Ok",
          timer: 3000,
          html: response.message,
        });
        dispatch(fetchFeatureFlags(loader));
      } else {
        Swal.fire({
          title: "error",
          icon: "error",
          showCloseButton: true,
          cancelButtonText: "Ok",
          timer: 3000,
          html: response.message,
        });
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        icon: "error",
        showCloseButton: true,
        cancelButtonText: "Ok",
        timer: 3000,
        html: e.message,
      });
    }
  };

export const editFeatureItem =
  (loader, callback: () => void) => async (dispatch, getState) => {
    loader(true);
    const state = getState();
    const { id, createdAt, ...rest } = state.featureFlag.model_edit;
    const restData = rest;
    try {
      dispatch(resetError());
      const state = getState();
      const validationState = validateFormRules(
        state.featureFlag.model_edit,
        featureFlagFormRules
      );
      if (!validationState.valid) {
        dispatch(setError(validationState.errors));
        loader(false);
        return;
      }
      dispatch(resetError());
      const response = await apiClient.patch(
        `${ADMIN_USER_DATA}`,
        { ...restData },
        true
      );
      if (response.success === true) {
        Swal.fire({
          title: "success",
          icon: "success",
          showCloseButton: true,
          cancelButtonText: "Ok",
          timer: 3000,
          html: response.message,
        });
        callback();
        dispatch(fetchFeatureFlags(loader));
      } else {
        Swal.fire({
          title: "error",
          icon: "error",
          showCloseButton: true,
          cancelButtonText: "Ok",
          timer: 3000,
          html: response.message,
        });
      }
      loader(false);
    } catch (e) {
      Swal.fire({
        title: "error",
        icon: "error",
        showCloseButton: true,
        cancelButtonText: "Ok",
        timer: 3000,
        html: e.message,
      });
    }
  };

export const createNewFeatureItem =
  (loader, callback: () => void) => async (dispatch, getState) => {
    loader(true);
    dispatch(resetError());
    try {
      createFeatureItem();
      dispatch(resetError());
      const state = getState();
      const validationState = validateFormRules(
        state.featureFlag.model_edit,
        featureFlagFormRules
      );
      if (!validationState.valid) {
        dispatch(setError(validationState.errors));
        loader(false);
        return;
      }
      dispatch(resetError());
      const response = await apiClient.post(
        `${ADMIN_USER_DATA}`,
        { ...state.featureFlag.model_edit },
        true
      );
      if (response.success === true) {
        Swal.fire({
          title: "success",
          icon: "success",
          showCloseButton: true,
          cancelButtonText: "Ok",
          timer: 3000,
          html: response.message,
        });
        callback();
        dispatch(fetchFeatureFlags(loader));
      } else {
        Swal.fire({
          title: "error",
          icon: "error",
          showCloseButton: true,
          cancelButtonText: "Ok",
          timer: 3000,
          html: response.message,
        });
      }
      loader(false);
    } catch (e) {
      Swal.fire({
        title: "error",
        icon: "error",
        showCloseButton: true,
        cancelButtonText: "Ok",
        timer: 3000,
        html: e.message,
      });
    }
  };

const fetureFlagReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_DATA_LIST: {
      return {
        ...state,
        featureFlagList: action.data,
        isLoading: false,
        isDataLoaded: true,
      };
    }

    case actions.ADD_NAME_DATA: {
      return {
        ...state,
        model_edit: action.data[0],
        isLoading: false,
        isDataLoaded: true,
      };
    }

    case actions.CREATE_NEW_FEATURE_EMT: {
      return {
        ...state,
        model_edit: action.payload,
        isLoading: false,
        isDataLoaded: true,
      };
    }

    case actions.CHANGE_INPUT_VALUE: {
      return {
        ...state,
        model_edit: {
          ...(state.model_edit || {}),
          ...(action.payload || {}),
        },
      };
    }

    case actions.RESET_FROM_ERROR: {
      return {
        ...state,
        error: {},
      };
    }

    case actions.SET_FROM_ERROR: {
      return {
        ...state,
        error: {
          ...(state.error || {}),
          ...(action.payload || {}),
        },
      };
    }
    case actions.ADD_PILOT_IDS: {
      return {
        ...state,
        pilotIds: action.data,
      };
    }

    default:
      return state;
  }
};

export default fetureFlagReducer;
