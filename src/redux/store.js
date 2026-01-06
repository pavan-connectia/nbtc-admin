import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage by default for the web
import { combineReducers } from "redux";

import { aboutusApi } from "./api/aboutus";
import { aboutusDeptApi } from "./api/aboutusDept";
import { affiliatesApi } from "./api/affiliates";
import { authApi } from "./api/auth";
import { awardsApi } from "./api/awards";
import { branchesApi } from "./api/branches";
import { brandsApi } from "./api/brands";
import { careersFormApi } from "./api/careersForm";
import { careersInfoApi } from "./api/careersInfo";
import { careersOpeningApi } from "./api/careersOpening";
import { categoryApi } from "./api/category";
import { clientsApi } from "./api/clients";
import { contactFormApi } from "./api/contactForm";
import { contactInfoApi } from "./api/contactInfo";
import { coreBusinessApi } from "./api/coreBusiness";
import { csrApi } from "./api/csr";
import { eventApi } from "./api/event";
import { facilityApi } from "./api/facility";
import { homeApi } from "./api/home";
import { homeDeptApi } from "./api/homeDept";
import { imgGalleryApi } from "./api/imgGallery";
import { mailinglistApi } from "./api/mailinglist";
import { mailinglistDeptApi } from "./api/mailinglistDept";
import { milestonesApi } from "./api/milestones";
import { milestonesDeptApi } from "./api/milestonesDept";
import { newsApi } from "./api/news";
import { projectsApi } from "./api/projects";
import { publicationApi } from "./api/publication";
import { qhseApi } from "./api/qhse";
import { qualificationApi } from "./api/qualification";
import { qualificationLocApi } from "./api/qualificationLoc";
import { quotationApi } from "./api/quotation";
import { regionApi } from "./api/region";
import { regionAwardsApi } from "./api/regionAwards";
import { regionProjectsApi } from "./api/regionProjects";
import { serviceApi } from "./api/service";
import { subcategoryApi } from "./api/subcategory";
import { supportServiceApi } from "./api/supportService";
import { uploadApi } from "./api/upload";
import { videoGalleryApi } from "./api/videGallery";

import authReducer from "./reducer/authReducer";
import themeReducer from "./reducer/themeReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  [aboutusApi.reducerPath]: aboutusApi.reducer,
  [aboutusDeptApi.reducerPath]: aboutusDeptApi.reducer,
  [affiliatesApi.reducerPath]: affiliatesApi.reducer,
  [awardsApi.reducerPath]: awardsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [branchesApi.reducerPath]: branchesApi.reducer,
  [brandsApi.reducerPath]: brandsApi.reducer,
  [careersFormApi.reducerPath]: careersFormApi.reducer,
  [careersInfoApi.reducerPath]: careersInfoApi.reducer,
  [careersOpeningApi.reducerPath]: careersOpeningApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [clientsApi.reducerPath]: clientsApi.reducer,
  [contactFormApi.reducerPath]: contactFormApi.reducer,
  [contactInfoApi.reducerPath]: contactInfoApi.reducer,
  [coreBusinessApi.reducerPath]: coreBusinessApi.reducer,
  [csrApi.reducerPath]: csrApi.reducer,
  [eventApi.reducerPath]: eventApi.reducer,
  [facilityApi.reducerPath]: facilityApi.reducer,
  [homeApi.reducerPath]: homeApi.reducer,
  [homeDeptApi.reducerPath]: homeDeptApi.reducer,
  [imgGalleryApi.reducerPath]: imgGalleryApi.reducer,
  [mailinglistApi.reducerPath]: mailinglistApi.reducer,
  [mailinglistDeptApi.reducerPath]: mailinglistDeptApi.reducer,
  [milestonesApi.reducerPath]: milestonesApi.reducer,
  [milestonesDeptApi.reducerPath]: milestonesDeptApi.reducer,
  [newsApi.reducerPath]: newsApi.reducer,
  [projectsApi.reducerPath]: projectsApi.reducer,
  [publicationApi.reducerPath]: publicationApi.reducer,
  [qhseApi.reducerPath]: qhseApi.reducer,
  [qualificationApi.reducerPath]: qualificationApi.reducer,
  [qualificationLocApi.reducerPath]: qualificationLocApi.reducer,
  [quotationApi.reducerPath]: quotationApi.reducer,
  [regionApi.reducerPath]: regionApi.reducer,
  [regionAwardsApi.reducerPath]: regionAwardsApi.reducer,
  [regionProjectsApi.reducerPath]: regionProjectsApi.reducer,
  [serviceApi.reducerPath]: serviceApi.reducer,
  [subcategoryApi.reducerPath]: subcategoryApi.reducer,
  [supportServiceApi.reducerPath]: supportServiceApi.reducer,
  [uploadApi.reducerPath]: uploadApi.reducer,
  [videoGalleryApi.reducerPath]: videoGalleryApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    })
      .concat(aboutusApi.middleware)
      .concat(aboutusDeptApi.middleware)
      .concat(affiliatesApi.middleware)
      .concat(awardsApi.middleware)
      .concat(authApi.middleware)
      .concat(branchesApi.middleware)
      .concat(brandsApi.middleware)
      .concat(careersFormApi.middleware)
      .concat(careersInfoApi.middleware)
      .concat(careersOpeningApi.middleware)
      .concat(categoryApi.middleware)
      .concat(clientsApi.middleware)
      .concat(contactFormApi.middleware)
      .concat(contactInfoApi.middleware)
      .concat(coreBusinessApi.middleware)
      .concat(csrApi.middleware)
      .concat(eventApi.middleware)
      .concat(facilityApi.middleware)
      .concat(homeApi.middleware)
      .concat(homeDeptApi.middleware)
      .concat(imgGalleryApi.middleware)
      .concat(mailinglistApi.middleware)
      .concat(mailinglistDeptApi.middleware)
      .concat(milestonesApi.middleware)
      .concat(milestonesDeptApi.middleware)
      .concat(newsApi.middleware)
      .concat(projectsApi.middleware)
      .concat(publicationApi.middleware)
      .concat(qhseApi.middleware)
      .concat(qualificationApi.middleware)
      .concat(qualificationLocApi.middleware)
      .concat(quotationApi.middleware)
      .concat(regionApi.middleware)
      .concat(regionAwardsApi.middleware)
      .concat(regionProjectsApi.middleware)
      .concat(serviceApi.middleware)
      .concat(subcategoryApi.middleware)
      .concat(supportServiceApi.middleware)
      .concat(uploadApi.middleware)
      .concat(videoGalleryApi.middleware),
});

export const persistor = persistStore(store);
