import React, { useState } from "react";

function OnboardingPopup({ onClose }) {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
        {/* Step Content */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-purple-700 mb-2">Step 1: Talk Time</h2>
            <p className="text-gray-700">
              Here you can see your <b>total chat, video, and audio talk time</b>. 
              It helps track your consultations.
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-purple-700 mb-2">Step 2: Set Rates</h2>
            <p className="text-gray-700">
              You can set your consultation rates here. 
              <br /> Allowed range: <b>₹5 – ₹100</b>.
            </p>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-purple-700 mb-2">Step 3: Go Online</h2>
            <p className="text-gray-700">
              Toggle <b>online</b> for Chat, Video, or Audio to be available for users.  
              When offline, users can’t consult you.
            </p>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-purple-700 mb-2">Step 4: Consultations</h2>
            <p className="text-gray-700">
              In the <b>Consultations tab</b>, you can <b>join sessions</b>.  
              <br />⚠️ Note: You <b>cannot end</b> a consultation until the user ends it from their side.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="px-3 py-1 bg-gray-200 rounded-lg"
            >
              Back
            </button>
          ) : (
            <span />
          )}

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="px-4 py-1 bg-purple-600 text-white rounded-lg"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-1 bg-green-600 text-white rounded-lg"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OnboardingPopup;
