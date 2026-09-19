/** RU: Соцсети футера — inline SVG 24×24. EN: Footer social icons as fixed inline SVGs. */
export function FooterSocialIcons({
  social,
}: {
  social: {
    telegram: string;
    facebook: string;
    linkedin: string;
    youtube: string;
    instagram: string;
  };
}) {
  return (
    <div className="wrapper is--h-flex-center-left is--gap-12 site-footer-social">
      <a
        href={social.telegram}
        target="_blank"
        className="footer-icon-wrapper w-inline-block"
        rel="noopener noreferrer"
        aria-label="Telegram"
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47717 6.47717 2 12 2C17.5228 2 22 6.47717 22 12ZM8.69646 11.084C7.69471 11.5213 6.66546 11.9707 5.72427 12.4892C5.23282 12.849 5.88599 13.1035 6.49879 13.3423C6.59621 13.3802 6.69258 13.4178 6.78321 13.4553C6.85862 13.4785 6.93529 13.5029 7.013 13.5277C7.69454 13.7448 8.45446 13.9869 9.11612 13.6227C10.203 12.9983 11.2287 12.2765 12.2537 11.5552C12.5895 11.3189 12.9252 11.0826 13.263 10.8499C13.2788 10.8397 13.2966 10.8282 13.3162 10.8155C13.6039 10.629 14.251 10.2095 14.0116 10.7875C13.4456 11.4065 12.8393 11.9545 12.2298 12.5054C11.819 12.8767 11.4066 13.2494 11.0041 13.646C10.6536 13.9309 10.2895 14.5037 10.6821 14.9025C11.5862 15.5355 12.5045 16.153 13.4222 16.7703C13.7208 16.9711 14.0194 17.172 14.3174 17.3733C14.8225 17.7765 15.6119 17.4503 15.7229 16.8202C15.7723 16.5303 15.8219 16.2405 15.8715 15.9506C16.1455 14.3487 16.4195 12.7461 16.6617 11.139C16.6946 10.8868 16.7319 10.6347 16.7692 10.3825C16.8597 9.77125 16.9503 9.15921 16.9785 8.54462C16.9056 7.93129 16.162 8.06617 15.7481 8.20408C13.621 9.0135 11.515 9.88292 9.41746 10.7677C9.17983 10.8729 8.93896 10.9781 8.69646 11.084Z"
            fill="currentColor"
          />
        </svg>
      </a>
      <a
        href={social.facebook}
        target="_blank"
        className="footer-icon-wrapper w-inline-block"
        rel="noopener noreferrer"
        aria-label="Facebook"
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.0025 3H3.9975C3.4483 3.00408 3.00408 3.4483 3 3.9975V20.0025C3.00408 20.5517 3.4483 20.9959 3.9975 21H12.615V14.04H10.275V11.3175H12.615V9.315C12.615 6.99 14.0325 5.7225 16.1175 5.7225C16.815 5.7225 17.5125 5.7225 18.21 5.8275V8.25H16.7775C15.645 8.25 15.4275 8.79 15.4275 9.5775V11.31H18.1275L17.775 14.0325H15.4275V21H20.0025C20.5517 20.9959 20.9959 20.5517 21 20.0025V3.9975C20.9959 3.4483 20.5517 3.00408 20.0025 3Z"
            fill="currentColor"
          />
        </svg>
      </a>
      <a
        href={social.linkedin}
        target="_blank"
        className="footer-icon-wrapper w-inline-block"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.6575 3H4.3425C3.61669 2.99564 3.02038 3.57197 3 4.2975V19.65C3.01639 20.3773 3.61508 20.9559 4.3425 20.9475H19.6575C20.3849 20.9559 20.9836 20.3773 21 19.65V4.2975C20.9796 3.57197 20.3833 2.99564 19.6575 3ZM8.3325 18.3075H5.6925V9.75H8.3325V18.3075ZM7.0425 8.5575C6.19951 8.55775 5.51036 7.88525 5.49 7.0425C5.47516 6.62638 5.63396 6.22282 5.92839 5.92839C6.22282 5.63396 6.62638 5.47517 7.0425 5.49C7.8561 5.54665 8.48716 6.22318 8.48716 7.03875C8.48716 7.85432 7.8561 8.53085 7.0425 8.5875V8.5575ZM18.36 18.255H15.75V14.07C15.75 13.0725 15.75 11.775 14.355 11.775C12.96 11.775 12.75 12.87 12.75 13.9725V18.21H10.08V9.75H12.57V10.875H12.6225C13.1428 9.97146 14.1234 9.43341 15.165 9.48C17.8575 9.48 18.36 11.28 18.36 13.5675V18.255Z"
            fill="currentColor"
          />
        </svg>
      </a>
      <a
        href={social.youtube}
        target="_blank"
        className="footer-icon-wrapper w-inline-block"
        rel="noopener noreferrer"
        aria-label="YouTube"
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.0571 6.94499C21.8139 6.04146 21.1081 5.3357 20.2046 5.09249C18.5696 4.64999 11.9996 4.64999 11.9996 4.64999C11.9996 4.64999 5.42959 4.64999 3.79459 5.09249C2.89106 5.3357 2.18529 6.04146 1.94209 6.94499C1.6368 8.61244 1.48865 10.3049 1.49959 12C1.48865 13.6951 1.6368 15.3875 1.94209 17.055C2.18529 17.9585 2.89106 18.6643 3.79459 18.9075C5.42959 19.35 11.9996 19.35 11.9996 19.35C11.9996 19.35 18.5696 19.35 20.2046 18.9075C21.1081 18.6643 21.8139 17.9585 22.0571 17.055C22.3624 15.3875 22.5105 13.6951 22.4996 12C22.5105 10.3049 22.3624 8.61244 22.0571 6.94499V6.94499ZM9.89959 15.15V8.84999L15.3521 12L9.89959 15.15Z"
            fill="currentColor"
          />
        </svg>
      </a>
      <a
        href={social.instagram}
        target="_blank"
        className="footer-icon-wrapper w-inline-block"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.25 1.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>
  );
}
