import React from "react";

const SuccessAlert4 = () => {
  return (
    <div className="py-1 bg-white dark:bg-dark">
      <div className="container">
        <div className="border-stroke dark:border-dark-3 mb-1 flex items-center rounded-md border border-l-[8px] border-l-[#00B078] bg-white dark:bg-dark-2 p-5 pl-8">
          <div className="mr-5 flex h-[36px] w-full max-w-[36px] items-center justify-center rounded-full bg-[#00B078]">
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.4038 4.22274C17.883 4.70202 17.883 5.47909 17.4038 5.95837L8.40377 14.9584C7.92449 15.4376 7.14742 15.4376 6.66814 14.9584L2.57723 10.8675C2.09795 10.3882 2.09795 9.61111 2.57723 9.13183C3.05651 8.65255 3.83358 8.65255 4.31286 9.13183L7.53595 12.3549L15.6681 4.22274C16.1474 3.74346 16.9245 3.74346 17.4038 4.22274Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="flex w-full items-center justify-between">
            <div>
              <h3 className="mb-1 text-lg font-medium text-dark dark:text-white">
              Welcome to NexScholar!
              </h3>
              <p className="text-body-color dark:text-dark-6 text-sm">
              We are excited to invite you to test out NexScholar, the platform designed to revolutionize academic collaboration. As we're still in the development phase, please note that some features, including our AI-powered matching system, are not yet available.

Your feedback is incredibly valuable as we continue to improve and fine-tune the platform. We appreciate your participation in shaping the future of academic collaboration.

Feel free to explore the available features, and stay tuned for future updates. Thank you for being a part of NexScholar's journey!
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert4;
