'use client';

import { Fragment, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface ToastProps {
  show: boolean;
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  show,
  message,
  type = 'success',
  onClose,
  duration = 3000
}: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-[-100%] opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 min-w-[320px] max-w-[90vw]">
        <div className="rounded border-0 bg-white shadow-lg">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 pt-0.5">
                {type === 'success' ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                ) : (
                  <XCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1 flex items-center justify-between gap-4">
                <p className="text-base font-medium text-gray-900">
                  {message}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md p-1.5 inline-flex text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <span className="sr-only">Закрыть</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}