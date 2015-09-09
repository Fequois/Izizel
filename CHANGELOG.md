## Change Log

### 0.6.0
 - Major Sass structure refactor (and hopefully the last one).
 - Various components re-prioritized to better compatibility.
 - Lifted some pretty cool shit from Bootstrap 4 alpha.
 - Made the whole css "normalization" a little less obtrusive/strict.
 - Fixed the jQuery dependency to correctly download 2.1.x instead of 1.x.
 - Removed css "prefixes". It might sound counter-productive but I will never
   integrate any complicated components or scripts that can cause conflicts.
 - Dropped Modernizr as dependency; prefer custom builds (lighter).
 - Updated Node.js dependencies again

### 0.5.0.1
 - Update Node.js dependencies

### 0.5.0
 - Brought Normalize.css up to speed.
 - Modified and merged Normalize.css and Sanitize.scss.
 - Integrated the result of above into the project to avoid duplicate entries
   and allow for easier and quicker customization. (Usable, but not done yet.)
 - Started work on basic typography.
 - We now require 'modular-scale' in Bower.
 - Updated `npm` dependencies (for Gulp).
 - Updated `scss-lint.yml` to the newest version of 'scss-lint' (0.39.0)

### 0.4.0
 - Rewrote `Gulpfile.js` again. I've had enough of it for now.
 - Small updates throughout the project to prepare for some "real work."

### 0.3.0
 - This commit got lost in translation.
 - Minor CSS bug fixes and refactoring of directory structure.

### 0.2.0
 - Rebooted project and rewrote the `gulpfile.js` based on Google's Web
   Starter Kit.
 - Introduced our friend Bower to the project.
 - Various updates to Sass files.

### 0.1.0
 - Initial commit of directory structure and a bunch of empty files.
 - Basic `gulpfile.js`.
 - Project settings (jshint and scss-lint).
