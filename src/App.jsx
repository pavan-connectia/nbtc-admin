import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import RedirectIfAuthenticated from "./components/layout/RedirectIfAuthenticated";

const Affliates = lazy(() => import("./pages/affiliates/Affiliates"));
const AddAffiliate = lazy(() => import("./pages/affiliates/AddAffliliate"));
const DetailAffliate = lazy(
  () => import("./pages/affiliates/DetailAffiliates"),
);

const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const Login = lazy(() => import("./pages/auth/Login"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

const Awards = lazy(() => import("./pages/awards/Awards"));
const AddAward = lazy(() => import("./pages/awards/AddAwards"));
const DetailAward = lazy(() => import("./pages/awards/DetailAwards"));

const Branches = lazy(() => import("./pages/branches/Branches"));
const AddBranch = lazy(() => import("./pages/branches/AddBranch"));
const DetailBranch = lazy(() => import("./pages/branches/DetailBranch"));

const Brands = lazy(() => import("./pages/brands/Brands"));
const AddBrand = lazy(() => import("./pages/brands/AddBrand"));
const DetailBrand = lazy(() => import("./pages/brands/DetailBrand"));

const CareersForm = lazy(() => import("./pages/careers/CareersForm"));
const CareersOpening = lazy(() => import("./pages/careers/CareersOpening"));
const AddCareerOpening = lazy(() => import("./pages/careers/AddCareerOpening"));
const DetailCareerOpening = lazy(
  () => import("./pages/careers/DetailCareerOpening"),
);

const ContactForm = lazy(() => import("./pages/contact/ContactForm"));
const ContactInfo = lazy(() => import("./pages/contact/ContactInfo"));
const AddContactInfo = lazy(() => import("./pages/contact/AddContactInfo"));
const DetailContactInfo = lazy(
  () => import("./pages/contact/DetailContactInfo"),
);

const CoreBusiness = lazy(() => import("./pages/coreBusiness/CoreBusiness"));
const AddCoreBusiness = lazy(
  () => import("./pages/coreBusiness/AddCoreBusiness"),
);
const DetailCoreBusiness = lazy(
  () => import("./pages/coreBusiness/DetailCoreBusiness"),
);

const Csr = lazy(() => import("./pages/news/Csr"));
const ImgGallery = lazy(() => import("./pages/news/ImgGallery"));
const LatestNews = lazy(() => import("./pages/news/LatestNews"));
const AddNews = lazy(() => import("./pages/news/AddNews"));
const DetailNews = lazy(() => import("./pages/news/DetailNews"));
const Publication = lazy(() => import("./pages/news/Publication"));
const VideoGallery = lazy(() => import("./pages/news/VideoGallery"));

const SubCategory = lazy(() => import("./pages/sub-category/SubCategory"));
const DetailSubCategory = lazy(
  () => import("./pages/sub-category/DetailSubCategory"),
);
const AddSubCategory = lazy(
  () => import("./pages/sub-category/AddSubCategory"),
);

const BannerImage = lazy(() => import("./pages/banner"))

const Region = lazy(() => import("./pages/region/Region"));

const Aboutus = lazy(() => import("./pages/Aboutus"));
const AboutusDept = lazy(() => import("./pages/AboutusDept"));
const Category = lazy(() => import("./pages/Category"));
const Clients = lazy(() => import("./pages/Clients"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Home = lazy(() => import("./pages/Home"));
const HomeDept = lazy(() => import("./pages/HomeDept"));
const Event = lazy(() => import("./pages/Event"));
const Facility = lazy(() => import("./pages/Facility"));
const MailingList = lazy(() => import("./pages/MailingList"));
const MailingListDept = lazy(() => import("./pages/MailingListDept"));
const Milestones = lazy(() => import("./pages/Milestones"));
const MilestonesDept = lazy(() => import("./pages/MilestonesDept"));
const Notification = lazy(() => import("./pages/Notification"));
const Projects = lazy(() => import("./pages/Projects"));
const Profile = lazy(() => import("./pages/Profile"));
const Service = lazy(() => import("./pages/Service"));
const Qhse = lazy(() => import("./pages/Qhse"));
const Qualifications = lazy(() => import("./pages/Qualifications"));
const Quotation = lazy(() => import("./pages/Quotation"));
const Roles = lazy(() => import("./pages/Roles"));
const SupportService = lazy(() => import("./pages/SupportService"));


const App = () => {
  return (
    <Layout>
      <Suspense fallback="">
        <Routes>
          <Route element={<RedirectIfAuthenticated />}>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/affiliates" element={<Affliates />} />
            <Route path="/affiliates/add" element={<AddAffiliate />} />
            <Route path="/affiliates/:id" element={<DetailAffliate />} />

            <Route path="/awards" element={<Awards />} />
            <Route path="/awards/add" element={<AddAward />} />
            <Route path="/awards/:id" element={<DetailAward />} />

            <Route path="/branches" element={<Branches />} />
            <Route path="/branches/add" element={<AddBranch />} />
            <Route path="/branches/:id" element={<DetailBranch />} />

            <Route path="/brands" element={<Brands />} />
            <Route path="/brands/add" element={<AddBrand />} />
            <Route path="/brands/:id" element={<DetailBrand />} />

            <Route path="/careers/careers-form" element={<CareersForm />} />
            <Route
              path="/careers/careers-opening"
              element={<CareersOpening />}
            />
            <Route
              path="/careers/careers-opening/add"
              element={<AddCareerOpening />}
            />
            <Route
              path="/careers/careers-opening/:id"
              element={<DetailCareerOpening />}
            />

            <Route path="/contact/contact-form" element={<ContactForm />} />
            <Route path="/contact/contact-info" element={<ContactInfo />} />
            <Route
              path="/contact/contact-info/add"
              element={<AddContactInfo />}
            />
            <Route
              path="/contact/contact-info/:id"
              element={<DetailContactInfo />}
            />

            <Route path="/core-business" element={<CoreBusiness />} />
            <Route path="/core-business/add" element={<AddCoreBusiness />} />
            <Route path="/core-business/:id" element={<DetailCoreBusiness />} />

            <Route path="/news/csr" element={<Csr />} />
            <Route path="/news/image-gallery" element={<ImgGallery />} />
            <Route path="/news/latest-news" element={<LatestNews />} />
            <Route path="/news/latest-news/add" element={<AddNews />} />
            <Route path="/news/latest-news/:id" element={<DetailNews />} />
            <Route path="/news/publication" element={<Publication />} />
            <Route path="/news/video-gallery" element={<VideoGallery />} />

            <Route path="/banners" element={<BannerImage />} />

            <Route path="/equipments" element={<SubCategory />} />
            <Route path="/equipments/add" element={<AddSubCategory />} />
            <Route path="/equipments/:id" element={<DetailSubCategory />} />
            <Route path="/equipments/category" element={<Category />} />

            <Route path="/regions" element={<Region />} />

            <Route path="/home" element={<Home />} />
            <Route path="/home-department" element={<HomeDept />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/aboutus" element={<Aboutus />} />
            <Route path="/aboutus-department" element={<AboutusDept />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/event" element={<Event />} />
            <Route path="/facility" element={<Facility />} />
            <Route path="/mailinglist" element={<MailingList />} />
            <Route
              path="/mailinglist-department"
              element={<MailingListDept />}
            />
            <Route path="/milestones" element={<Milestones />} />
            <Route path="/milestones-department" element={<MilestonesDept />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/qhse" element={<Qhse />} />
            <Route path="/qualification" element={<Qualifications />} />
            <Route path="/quotation" element={<Quotation />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/service" element={<Service />} />
            <Route path="/support-service" element={<SupportService />} />
          </Route>
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
