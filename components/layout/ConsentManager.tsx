'use client';

/**
 * Consent Manager Component
 * Provides a persistent way for users to manage their cookie preferences
 */

import React, { useState } from 'react';
import { Settings, Cookie } from 'lucide-react';
import { useConsent } from '../../hooks/useConsent';
import { CookiePreferences } from '../../lib/consentManager';

interface ConsentManagerProps {
  className?: string;
  variant?: 'link' | 'button' | 'icon';
}

export function ConsentManager({ className = '', variant = 'link' }: ConsentManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const { preferences, updateConsent, revokeConsent } = useConsent();
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = () => {
    setLocalPreferences(preferences);
    setShowModal(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      updateConsent(localPreferences, 'custom');
      setShowModal(false);
    } catch (error) {
      console.error('Failed to update consent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async () => {
    setIsLoading(true);
    try {
      revokeConsent();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to revoke consent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTrigger = () => {
    const baseClasses = "inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity";
    
    switch (variant) {
      case 'button':
        return (
          <button 
            onClick={handleOpenModal}
            className={`${baseClasses} px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
          >
            <Settings className="w-4 h-4" />
            Cookie Settings
          </button>
        );
      case 'icon':
        return (
          <button 
            onClick={handleOpenModal}
            className={`${baseClasses} p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
            title="Manage cookie preferences"
          >
            <Cookie className="w-4 h-4" />
          </button>
        );
      default:
        return (
          <button 
            onClick={handleOpenModal}
            className={`${baseClasses} text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 ${className}`}
          >
            <Cookie className="w-4 h-4" />
            Cookie Settings
          </button>
        );
    }
  };

  return (
    <>
      {renderTrigger()}

      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md px-4 py-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-manager-title"
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md relative border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 id="consent-manager-title" className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Cookie Preferences
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage your cookie preferences. You can enable or disable different types of cookies below.
            </p>

            <div className="space-y-3 mb-6">
              {[
                {
                  key: "necessary" as keyof CookiePreferences,
                  label: "Necessary Cookies",
                  desc: "Essential for security, accessibility, and site functionality.",
                  disabled: true,
                },
                {
                  key: "functional" as keyof CookiePreferences,
                  label: "Functional Cookies",
                  desc: "Remember preferences and enhance your experience.",
                },
                {
                  key: "analytics" as keyof CookiePreferences,
                  label: "Analytics Cookies",
                  desc: "Help us understand how you use our site to improve it.",
                },
                {
                  key: "marketing" as keyof CookiePreferences,
                  label: "Marketing Cookies",
                  desc: "Used to deliver relevant ads and track ad performance.",
                },
              ].map((cookie) => (
                <div key={cookie.key} className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-900 dark:text-white text-sm block mb-1">
                      {cookie.label}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                      {cookie.desc}
                    </p>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={localPreferences[cookie.key]}
                        disabled={cookie.disabled || isLoading}
                        onChange={(e) =>
                          setLocalPreferences({ 
                            ...localPreferences, 
                            [cookie.key]: e.target.checked 
                          })
                        }
                        className="sr-only"
                        id={`consent-manager-${cookie.key}`}
                      />
                      <label
                        htmlFor={`consent-manager-${cookie.key}`}
                        className={`
                          w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0
                          ${localPreferences[cookie.key] 
                            ? 'bg-black dark:bg-white border-black dark:border-white' 
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }
                          ${cookie.disabled || isLoading ? 'cursor-not-allowed opacity-60' : ''}
                        `}
                      >
                        {localPreferences[cookie.key] && (
                          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowModal(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleRevoke}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Revoking...' : 'Revoke All'}
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}